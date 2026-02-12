import { validarBILocal, validarTelefoneLocal } from './angolanValidator';

const BASE_URL = 'https://angolaapi.onrender.com/api/v1/validate';
const BI_API_URL = 'https://bi-bs.minjusdh.gov.ao/pims-backend/api/v1/progress';

export interface NIFValidationResult {
  success: boolean;
  message: string;
  /** Nome associado ao NIF retornado pela Angola API */
  nome?: string;
  /** Estado do BI retornado pela API do MINJUSDH */
  estado?: string;
  /** Província extraída do código do BI */
  provincia?: string;
}

export interface PhoneValidationResult {
  success: boolean;
  message: string;
  operator?: string;
}

/**
 * Valida um BI/NIF angolano em 3 camadas:
 *
 * 1. Validação LOCAL (instantânea) — formato, comprimento, código de província
 *    Usa a mesma lógica do pacote "nestjs-angolan-validator".
 *    Se o formato for inválido, retorna erro imediatamente sem chamar APIs.
 *
 * 2. API oficial do MINJUSDH — verifica existência real no sistema governamental
 *    POST https://bi-bs.minjusdh.gov.ao/pims-backend/api/v1/progress
 *
 * 3. Fallback: Angola API — retorna nome associado ao NIF
 *    GET https://angolaapi.onrender.com/api/v1/validate/nif/:nif
 */
export async function validarNIF(nif: string): Promise<NIFValidationResult> {
  const valorNif = nif.trim().toUpperCase();

  // ── 1. Validação LOCAL (formato BI/NIF) ──
  const local = validarBILocal(valorNif);
  if (!local.valido) {
    return { success: false, message: local.mensagem };
  }

  // Formato é válido — agora verificar online
  // ── 2. Tentar API oficial do MINJUSDH ──
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const biResponse = await fetch(BI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        affairsReceipt: valorNif,
        affairsType: 'IDCard',
        captchaValue: '',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (biResponse.ok) {
      const biData = await biResponse.json();

      if (biData.affairsProgressState) {
        return {
          success: true,
          message: `BI/NIF verificado — Estado: ${biData.affairsProgressState} (${local.provincia})`,
          estado: biData.affairsProgressState,
          provincia: local.provincia,
        };
      }
    }
  } catch (error: any) {
    console.warn('API MINJUSDH indisponível:', error.message || error);
  }

  // ── 3. Fallback: Angola API (retorna nome) ──
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BASE_URL}/nif/${valorNif}`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: `NIF válido — ${data.nome} (${local.provincia})`,
        nome: data.nome,
        provincia: local.provincia,
      };
    }
  } catch (error) {
    console.warn('Angola API indisponível:', error);
  }

  // Se as APIs falharam mas o formato local é válido, aceitar com aviso
  return {
    success: true,
    message: `Formato válido (${local.provincia}) — verificação online indisponível.`,
    provincia: local.provincia,
  };
}

/**
 * Compara o nome digitado pelo utilizador com o nome associado ao NIF.
 * A comparação é flexível: ignora maiúsculas/minúsculas e acentos,
 * e verifica se todas as palavras digitadas existem no nome do NIF.
 */
export function nomeCorrespondeAoNIF(nomeDigitado: string, nomeNIF: string): boolean {
  const normalizar = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // remover acentos
      .toUpperCase()
      .trim();

  const partesDig = normalizar(nomeDigitado).split(/\s+/);
  const nomeNorm = normalizar(nomeNIF);

  // Cada palavra do nome digitado deve existir no nome do NIF
  return partesDig.every((parte) => nomeNorm.includes(parte));
}

/**
 * Valida um número de telefone angolano em 2 camadas:
 *
 * 1. Validação LOCAL (instantânea) — formato, prefixo, operadora
 * 2. Angola API online — confirmação adicional
 */
export async function validarTelefone(telefone: string): Promise<PhoneValidationResult> {
  // ── 1. Validação LOCAL ──
  const local = validarTelefoneLocal(telefone);
  if (!local.valido) {
    return { success: false, message: local.mensagem };
  }

  // Formato local válido — tentar confirmar online
  let numero = telefone.trim();
  if (!numero.startsWith('+244') && !numero.startsWith('244')) {
    numero = '+244' + numero;
  } else if (numero.startsWith('244') && !numero.startsWith('+244')) {
    numero = '+' + numero;
  }

  // ── 2. Angola API online ──
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BASE_URL}/phone/${numero}`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: `Número válido (${data.operator || local.operadora}).`,
        operator: data.operator || local.operadora,
      };
    }
    return { success: false, message: data.message || 'Número de telefone inválido.' };
  } catch (error) {
    console.warn('Angola API phone indisponível, usando validação local.');
    // API falhou mas o formato local é válido
    return {
      success: true,
      message: local.mensagem,
      operator: local.operadora,
    };
  }
}
