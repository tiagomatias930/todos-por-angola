import { ENV } from "@/src/config/env";

export interface ImageClassificationResult {
  primaryCategory: "infraestrutura" | "seguranca" | "saude" | "indefinido";
  confidence: number;
  suggestedActions: string[];
  description: string;
}

export interface SymptomAnalysisResult {
  summary: string;
  recommendations: string[];
  urgencyLevel: "baixa" | "moderada" | "alta";
  suggestedAction?: string;
}

const GEMINI_MODEL = "gemini-2.5-flash"; // Using latest model

/**
 * Call Gemini API for image classification
 * Analyzes an image to determine risk category
 */
export async function classifyRiskImageWithGemini(
  base64Image: string,
  categoryHint?: string
): Promise<ImageClassificationResult> {
  try {
    if (!ENV.GEMINI_API_KEY) {
      console.warn(
        "GEMINI_API_KEY not configured. Falling back to simulation."
      );
      return simulateImageClassification(categoryHint);
    }

    const prompt = `Analyze this image from Angola and classify the risk area. 
    
Answer in JSON format:
{
  "primaryCategory": "infraestrutura" | "seguranca" | "saude" | "indefinido",
  "confidence": 0.0-1.0,
  "description": "Brief description of the risk",
  "suggestedActions": ["action1", "action2", "action3"]
}

Categories:
- infraestrutura: Roads, water, electricity, drainage issues
- seguranca: Accidents, violence, public safety concerns
- saude: Health hazards, medical emergencies, hygiene issues
- indefinido: Unable to classify

${categoryHint ? `Hint: User suggested ${categoryHint}` : ""}

Respond ONLY with valid JSON, no additional text.`;

    const response = await fetch(
      `${ENV.GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse Gemini response. Using simulation.");
      return simulateImageClassification(categoryHint);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      primaryCategory: parsed.primaryCategory || "indefinido",
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      description: parsed.description || "Risk area detected",
      suggestedActions: Array.isArray(parsed.suggestedActions)
        ? parsed.suggestedActions.slice(0, 3)
        : ["Please provide more details about this risk."],
    };
  } catch (error) {
    console.error("Error calling Gemini for image classification:", error);
    return simulateImageClassification(categoryHint);
  }
}

/**
 * Call Gemini API for symptom analysis
 * Provides health guidance for reported symptoms
 */
export async function analyzeHealthSymptomsWithGemini(
  symptoms: string
): Promise<SymptomAnalysisResult> {
  try {
    if (!ENV.GEMINI_API_KEY) {
      console.warn(
        "GEMINI_API_KEY not configured. Falling back to simulation."
      );
      return simulateSymptomAnalysis(symptoms);
    }

    const prompt = `You are a health advisor for Angola. A person reports the following symptoms:

"${symptoms}"

Provide immediate guidance in Portuguese (Portugal spelling). Respond ONLY in valid JSON format:
{
  "summary": "Brief assessment of symptoms",
  "recommendations": ["rec1", "rec2", "rec3"],
  "urgencyLevel": "baixa" | "moderada" | "alta",
  "suggestedAction": "Suggested next step (e.g., 'Procure um hospital', 'Monitore em casa')"
}

Guidelines:
- Be cautious and suggest professional help when uncertain
- Urgency: baixa (monitor at home), moderada (see doctor soon), alta (emergency)
- Always remind that this is not professional medical advice
- Recommend 112 for emergencies

Respond ONLY with valid JSON.`;

    const response = await fetch(
      `${ENV.GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse Gemini health response. Using simulation.");
      return simulateSymptomAnalysis(symptoms);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      summary:
        parsed.summary ||
        "Unable to assess symptoms. Please consult a medical professional.",
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.slice(0, 4)
        : ["Procure um profissional de saúde"],
      urgencyLevel: parsed.urgencyLevel || "moderada",
      suggestedAction: parsed.suggestedAction,
    };
  } catch (error) {
    console.error("Error calling Gemini for symptom analysis:", error);
    return simulateSymptomAnalysis(symptoms);
  }
}

// Fallback simulations when Gemini is unavailable
function simulateImageClassification(
  categoryHint?: string
): ImageClassificationResult {
  const categories: Array<
    "infraestrutura" | "seguranca" | "saude" | "indefinido"
  > = ["infraestrutura", "seguranca", "saude"];
  const normalizedHint = categoryHint?.toLowerCase() || "";

  let category: "infraestrutura" | "seguranca" | "saude" | "indefinido" =
    "infraestrutura";

  if (normalizedHint.includes("seguranca")) category = "seguranca";
  else if (normalizedHint.includes("saude")) category = "saude";
  else if (normalizedHint.includes("medical")) category = "saude";

  const confidence = Math.random() * 0.4 + 0.6;

  return {
    primaryCategory: category,
    confidence: Number(confidence.toFixed(2)),
    description: `Área de risco detectada: ${category}`,
    suggestedActions: [
      "Forneça detalhes adicionais sobre a localização exacta",
      "Se possível, capture múltiplas fotos da área",
      "Inclua informações sobre impacto (pessoas afectadas, serviços bloqueados)",
    ],
  };
}

function simulateSymptomAnalysis(symptoms: string): SymptomAnalysisResult {
  const lower = symptoms.toLowerCase();
  const hasFever = lower.includes("febre") || lower.includes("temperatura");
  const hasPain = lower.includes("dor");
  const hasSevereSymptoms =
    lower.includes("peito") || lower.includes("falta de ar");

  const isSevere = hasSevereSymptoms;
  const isModerate = hasFever || hasPain;

  if (isSevere) {
    return {
      summary:
        "Os sintomas reportados podem ser graves. Procure atendimento medical imediatamente.",
      recommendations: [
        "Ligue para 112 ou dirija-se ao hospital mais próximo de imediato",
        "Se possível, avise um familiar",
        "Não dirija nem ande sozinho",
      ],
      urgencyLevel: "alta",
      suggestedAction: "Chamar emergência (112)",
    };
  }

  if (isModerate) {
    return {
      summary:
        "Os sintomas indicam um possível quadro que requer acompanhamento. Agende uma consulta médica.",
      recommendations: [
        "Descanse e mantenha-se hidratado",
        "Agende uma consulta com o seu médico ou procure um centro de saúde",
        "Monitore a evolução dos sintomas",
        "Evite automedicação sem orientação profissional",
      ],
      urgencyLevel: "moderada",
      suggestedAction: "Procurar atendimento médico",
    };
  }

  return {
    summary:
      "Sem sinais imediatos de gravidade. Monitore a evolução e procure ajuda se piorar.",
    recommendations: [
      "Mantenha uma alimentação equilibrada e hidratação",
      "Se os sintomas persistirem, agende uma consulta",
      "Em caso de piora súbita, dirija-se ao hospital",
    ],
    urgencyLevel: "baixa",
    suggestedAction: "Monitore e observe evolução",
  };
}
