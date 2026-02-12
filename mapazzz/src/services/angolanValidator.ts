/**
 * Validador local de documentos angolanos (BI/NIF e Telefone).
 *
 * Replica a lógica do pacote "nestjs-angolan-validator"
 * de forma compatível com React Native (sem dependências NestJS).
 */

// ── Códigos de província válidos ──
const PROVINCE_CODES = [
  'BA', // Bengo
  'BG', // Benguela
  'BI', // Bié
  'CB', // Cabinda
  'CC', // Cuando-Cubango
  'CN', // Cuanza Norte
  'CS', // Cuanza Sul
  'CU', // Cunene
  'HU', // Huambo
  'HI', // Huíla
  'LA', // Luanda
  'LN', // Lunda Norte
  'LS', // Lunda Sul
  'MA', // Malanje
  'MX', // Moxico
  'NA', // Namibe
  'UI', // Uíge
  'ZA', // Zaire
];

// ── Prefixos de operadoras angolanas ──
const PHONE_PREFIXES: Record<string, string> = {
  '91': 'Unitel',
  '92': 'Unitel',
  '93': 'Unitel',
  '94': 'Unitel',
  '95': 'Africell',
  '96': 'Africell',
  '97': 'Africell',
  '99': 'Movicel',
  '98': 'Movicel',
};

/**
 * Regex para o Bilhete de Identidade angolano.
 * Formato: 9 dígitos + 2 letras (código da província) + 3 dígitos
 * Exemplo: 006151112LA041
 */
const BI_REGEX = /^(\d{9})([A-Z]{2})(\d{3})$/;

/**
 * Valida o formato de um BI/NIF angolano localmente.
 * Verifica: comprimento, formato regex, e código de província válido.
 */
export function validarBILocal(valor: string): {
  valido: boolean;
  mensagem: string;
  provincia?: string;
} {
  const bi = valor.trim().toUpperCase();

  if (!bi) {
    return { valido: false, mensagem: 'O campo BI/NIF é obrigatório.' };
  }

  if (bi.length !== 14) {
    return {
      valido: false,
      mensagem: `BI/NIF deve ter 14 caracteres (tem ${bi.length}).`,
    };
  }

  const match = bi.match(BI_REGEX);
  if (!match) {
    return {
      valido: false,
      mensagem: 'Formato inválido. Exemplo: 006151112LA041',
    };
  }

  const codigoProvincia = match[2];
  if (!PROVINCE_CODES.includes(codigoProvincia)) {
    return {
      valido: false,
      mensagem: `Código de província "${codigoProvincia}" não é válido.`,
    };
  }

  const nomeProvincia = getProvinciaNome(codigoProvincia);
  return {
    valido: true,
    mensagem: `Formato válido (${nomeProvincia}).`,
    provincia: nomeProvincia,
  };
}

/**
 * Valida o formato de um número de telefone angolano localmente.
 * Aceita com ou sem prefixo +244.
 * Retorna a operadora se o prefixo for reconhecido.
 */
export function validarTelefoneLocal(valor: string): {
  valido: boolean;
  mensagem: string;
  operadora?: string;
} {
  let tel = valor.trim().replace(/[\s\-()]/g, '');

  // Remover prefixo internacional
  if (tel.startsWith('+244')) {
    tel = tel.substring(4);
  } else if (tel.startsWith('244')) {
    tel = tel.substring(3);
  } else if (tel.startsWith('00244')) {
    tel = tel.substring(5);
  }

  if (tel.length !== 9) {
    return {
      valido: false,
      mensagem: `O número deve ter 9 dígitos (tem ${tel.length}).`,
    };
  }

  if (!/^\d{9}$/.test(tel)) {
    return {
      valido: false,
      mensagem: 'O número deve conter apenas dígitos.',
    };
  }

  const prefix = tel.substring(0, 2);
  const operadora = PHONE_PREFIXES[prefix];

  if (!operadora) {
    return {
      valido: false,
      mensagem: `Prefixo "${prefix}" não corresponde a nenhuma operadora angolana.`,
    };
  }

  return {
    valido: true,
    mensagem: `Número válido (${operadora}).`,
    operadora,
  };
}

/** Mapeia o código de província para o nome completo */
function getProvinciaNome(codigo: string): string {
  const map: Record<string, string> = {
    BA: 'Bengo',
    BG: 'Benguela',
    BI: 'Bié',
    CB: 'Cabinda',
    CC: 'Cuando-Cubango',
    CN: 'Cuanza Norte',
    CS: 'Cuanza Sul',
    CU: 'Cunene',
    HU: 'Huambo',
    HI: 'Huíla',
    LA: 'Luanda',
    LN: 'Lunda Norte',
    LS: 'Lunda Sul',
    MA: 'Malanje',
    MX: 'Moxico',
    NA: 'Namibe',
    UI: 'Uíge',
    ZA: 'Zaire',
  };
  return map[codigo] || codigo;
}
