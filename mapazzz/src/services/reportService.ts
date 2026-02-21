import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "@/src/config/env";

const DEFAULT_API_BASE_URL = ENV.API_BASE_URL;

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
const AI_ENDPOINT = process.env.EXPO_PUBLIC_AI_ENDPOINT;
const EVIDENCE_UPLOAD_ENDPOINT =
  process.env.EXPO_PUBLIC_UPLOAD_ENDPOINT ?? `${API_BASE_URL}/upload`;
const REPORT_ENDPOINT =
  process.env.EXPO_PUBLIC_REPORT_ENDPOINT ?? `${API_BASE_URL}/postar_aria`;

export interface AnalyzeResponse {
  classification: string;
  confidence: number;
  recommendations: string[];
}

const FALLBACK_RESPONSES: Record<string, AnalyzeResponse> = {
  infraestrutura: {
    classification: "Possível dano em infraestrutura",
    confidence: 0.72,
    recommendations: [
      "Registe a dimensão aproximada",
      "Sinalize a população local se houver risco imediato",
    ],
  },
  seguranca: {
    classification: "Ocorrência de segurança pública",
    confidence: 0.68,
    recommendations: [
      "Confirme se existem feridos e contacte as autoridades",
      "Evite aproximar-se caso haja risco contínuo",
    ],
  },
  saude: {
    classification: "Possível incidente de saúde",
    confidence: 0.65,
    recommendations: [
      "Direcione o cidadão para a unidade de saúde mais próxima",
      "Reforce medidas básicas de higiene e prevenção",
    ],
  },
  default: {
    classification: "Ocorrência geral",
    confidence: 0.6,
    recommendations: [
      "Recolha mais detalhes no formulário",
      "Valide a categoria antes de enviar",
    ],
  },
};

export async function analyzeEvidence(
  categoria: string
): Promise<AnalyzeResponse> {
  const categoryKey = categoria.toLowerCase();
  const fallback =
    FALLBACK_RESPONSES[categoryKey] ?? FALLBACK_RESPONSES.default;

  if (!AI_ENDPOINT) {
    return fallback;
  }

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoria: categoryKey }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao contactar o serviço de IA: ${response.status}`);
    }

    const payload = (await response.json()) as Partial<AnalyzeResponse>;

    return {
      classification: payload.classification ?? fallback.classification,
      confidence: payload.confidence ?? fallback.confidence,
      recommendations: payload.recommendations ?? fallback.recommendations,
    };
  } catch (error) {
    console.warn("AI fallback acionado:", error);
    return fallback;
  }
}

export async function uploadEvidence(uri: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "evidencia.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetch(EVIDENCE_UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Falha no upload (${response.status})`);
    }

    const data = await response.json();
    return data.link ?? data.url ?? null;
  } catch (error) {
    console.error("Erro ao enviar evidência:", error);
    return null;
  }
}

interface SubmitOccurrencePayload {
  categoria: string;
  descricao: string;
  impacto?: string;
  prioridade?: string;
  enderecoFormatado?: string;
  latitude: number;
  longitude: number;
  mediaUrl?: string;
  analysis?: AnalyzeResponse;
}

export async function submitOccurrence(
  payload: SubmitOccurrencePayload
): Promise<any> {
  const token = await AsyncStorage.getItem("BearerToken");

  const body = {
    categoria: payload.categoria,
    descricao: payload.descricao,
    impacto: payload.impacto,
    prioridade: payload.prioridade,
    imagem: payload.mediaUrl,
    analise: payload.analysis,
    enderecoFormatado: payload.enderecoFormatado,
    lat: payload.latitude,
    log: payload.longitude,
    // Campos legados mantidos para compatibilidade com o backend existente.
    chuva: payload.impacto,
    temperatura: payload.analysis?.classification,
    tempo: payload.prioridade ?? payload.descricao,
  };

  const response = await fetch(REPORT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Erro ao registar ocorrência";
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch (error) {
      console.warn("Resposta inesperada ao registar ocorrência", error);
    }
    throw new Error(message);
  }

  return response.json();
}
