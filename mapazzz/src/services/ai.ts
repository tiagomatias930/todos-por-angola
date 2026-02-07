export interface ImageClassificationResult {
  primaryCategory: "infraestrutura" | "seguranca" | "saude" | "indefinido";
  confidence: number;
  suggestedActions: string[];
}

export interface SymptomAnalysisResult {
  summary: string;
  recommendations: string[];
  urgencyLevel: "baixa" | "moderada" | "alta";
}

const random = () => Math.random() * (0.9 - 0.6) + 0.6;

export async function simulateImageClassification(
  categoryHint: string | null,
): Promise<ImageClassificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const normalizedHint =
    categoryHint === "infraestrutura" || categoryHint === "seguranca"
      ? categoryHint
      : "infraestrutura";

  if (normalizedHint === "seguranca") {
    return {
      primaryCategory: "seguranca",
      confidence: Number(random().toFixed(2)),
      suggestedActions: [
        "Verifique se há feridos e acione o 112 se necessário.",
        "Recolha contacto de testemunhas para facilitar o atendimento.",
        "Compartilhe detalhes adicionais com as autoridades no formulário.",
      ],
    };
  }

  return {
    primaryCategory: "infraestrutura",
    confidence: Number(random().toFixed(2)),
    suggestedActions: [
      "Descreva o impacto do problema na mobilidade local.",
      "Informe se serviços essenciais (água, energia) foram afetados.",
      "Anexe mais fotos se possível para reforçar a evidência.",
    ],
  };
}

export async function simulateSymptomAnalysis(
  symptoms: string,
): Promise<SymptomAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const lower = symptoms.toLowerCase();

  if (lower.includes("febre") || lower.includes("dor")) {
    return {
      summary:
        "Os sintomas indicam um possível quadro infeccioso. Acompanhe a temperatura a cada 4 horas.",
      recommendations: [
        "Hidrate-se com água e soro caseiro.",
        "Caso a febre ultrapasse 39ºC ou dure mais de 48h, procure atendimento médico imediato.",
        "Evite automedicação sem orientação profissional.",
      ],
      urgencyLevel: "moderada",
    };
  }

  return {
    summary:
      "Sem sinais de gravidade identificados pela triagem automática. Observe a evolução dos sintomas.",
    recommendations: [
      "Descanse e mantenha uma alimentação equilibrada.",
      "Se os sintomas persistirem por mais de 72h, agende uma consulta médica.",
      "Em caso de piora súbita, dirija-se à unidade de urgência mais próxima.",
    ],
    urgencyLevel: "baixa",
  };
}
