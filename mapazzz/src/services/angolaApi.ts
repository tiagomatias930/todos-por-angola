const BASE_URL = 'https://angolaapi.onrender.com/api/v1/validate';

export interface NIFValidationResult {
  success: boolean;
  message: string;
}

export interface PhoneValidationResult {
  success: boolean;
  message: string;
  operator?: string;
}

/**
 * Valida um NIF angolano usando a Angola API (endpoint de BI).
 * O NIF angolano segue o mesmo formato do BI: ex. 006151112LA041
 */
export async function validarNIF(nif: string): Promise<NIFValidationResult> {
  try {
    const response = await fetch(`${BASE_URL}/bi/${nif}`);
    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, message: 'NIF válido.' };
    }
    return { success: false, message: data.message || 'NIF inválido.' };
  } catch (error) {
    console.error('Erro ao validar NIF:', error);
    return {
      success: false,
      message: 'Não foi possível validar o NIF. Verifique a sua conexão.',
    };
  }
}

/**
 * Valida um número de telefone angolano usando a Angola API.
 * O número deve incluir o prefixo +244: ex. +244923445618
 */
export async function validarTelefone(telefone: string): Promise<PhoneValidationResult> {
  // Garantir que o número tenha o prefixo +244
  let numero = telefone.trim();
  if (!numero.startsWith('+244') && !numero.startsWith('244')) {
    numero = '+244' + numero;
  } else if (numero.startsWith('244') && !numero.startsWith('+244')) {
    numero = '+' + numero;
  }

  try {
    const response = await fetch(`${BASE_URL}/phone/${numero}`);
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: `Número válido${data.operator ? ` (${data.operator})` : ''}.`,
        operator: data.operator,
      };
    }
    return { success: false, message: data.message || 'Número de telefone inválido.' };
  } catch (error) {
    console.error('Erro ao validar telefone:', error);
    return {
      success: false,
      message: 'Não foi possível validar o telefone. Verifique a sua conexão.',
    };
  }
}
