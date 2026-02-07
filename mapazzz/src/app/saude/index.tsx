import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { analyzeHealthSymptomsWithGemini, SymptomAnalysisResult } from "@/src/services/gemini";
import { getCategoryById } from "@/src/constants/reportCategories";

type UrgencyLevel = "baixa" | "moderada" | "alta";

const urgencyColors = {
  baixa: "#16A085",
  moderada: "#F39C12",
  alta: "#E74C3C",
};

const urgencyLabels = {
  baixa: "Baixa",
  moderada: "Moderada",
  alta: "Alta",
};

export default function HealthAssistantScreen() {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const healthCategory = getCategoryById("saude");

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Por favor, descreva seus sintomas antes de prosseguir."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeHealthSymptomsWithGemini(symptoms);
      setResult(analysisResult);
      setShowResult(true);
    } catch (error) {
      console.error("Erro ao analisar sintomas:", error);
      Alert.alert(
        "Erro",
        "Não foi possível analisar seus sintomas. Tente novamente."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setResult(null);
    setShowResult(false);
  };

  const handleEmergency = () => {
    Alert.alert(
      "Emergência Médica",
      "Se você está tendo uma emergência médica, ligue para 112 imediatamente.",
      [
        {
          text: "Entendi",
          onPress: () => router.push("/"),
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  if (showResult && result) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen options={{ title: "Análise de Sintomas" }} />

        <View style={styles.resultHeader}>
          <View
            style={[
              styles.urgencyBadge,
              { backgroundColor: urgencyColors[result.urgencyLevel] },
            ]}
          >
            <Text style={styles.urgencyBadgeText}>
              {urgencyLabels[result.urgencyLevel]}
            </Text>
          </View>
          <Text style={styles.resultTitle}>Resultado da Análise</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.summarySection}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: urgencyColors[result.urgencyLevel] },
              ]}
            >
              <Ionicons
                name={
                  result.urgencyLevel === "alta"
                    ? "alert"
                    : result.urgencyLevel === "moderada"
                    ? "information-circle"
                    : "checkmark-circle"
                }
                size={24}
                color="#fff"
              />
            </View>
            <View style={styles.summaryText}>
              <Text style={styles.summaryTitle}>Avaliação Preliminar</Text>
              <Text style={styles.summaryContent}>{result.summary}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recomendações</Text>
            {result.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.bullet} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.disclaimerCard}>
          <Ionicons
            name="warning"
            size={16}
            color="#E74C3C"
            style={styles.disclaimerIcon}
          />
          <Text style={styles.disclaimerText}>
            Esta é uma triagem automática e não substitui uma consulta médica
            profissional. Para diagnóstico completo, procure um profissional de
            saúde.
          </Text>
        </View>

        {result.urgencyLevel === "alta" && (
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergency}
          >
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.emergencyButtonText}>Chamar Emergência (112)</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleReset}>
          <Ionicons name="refresh" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.primaryButtonText}>Nova Análise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home" size={18} color="#0A3D62" style={styles.icon} />
          <Text style={styles.secondaryButtonText}>Voltar ao início</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Saúde & Primeiros Socorros" }} />

      <View style={styles.headerWrapper}>
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: healthCategory?.highlightColor || "#1B98F5" },
          ]}
        >
          <Ionicons name="medkit" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Saúde & Primeiros Socorros</Text>
        <Text style={styles.subtitle}>
          Receba orientação imediata para sintomas e emergências leves.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Descreva seus sintomas</Text>
        <Text style={styles.cardSubtitle}>
          Forneça detalhes para uma melhor avaliação:
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Ex: Dor de cabeça, febre acima de 38ºC, tosse seca..."
          placeholderTextColor="#BFC8CF"
          multiline
          numberOfLines={6}
          value={symptoms}
          onChangeText={setSymptoms}
          editable={!isAnalyzing}
        />

        <Text style={styles.inputHint}>
          Inclua duração dos sintomas, intensidade e qualquer informação
          relevante.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isAnalyzing && styles.disabledButton]}
        onPress={handleAnalyzeSymptoms}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.primaryButtonText}>Analisando...</Text>
          </>
        ) : (
          <>
            <Ionicons
              name="beaker"
              size={18}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.primaryButtonText}>Analisar Sintomas</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergency}
      >
        <Ionicons name="warning" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.emergencyButtonText}>Emergência Médica</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="home" size={18} color="#0A3D62" style={styles.icon} />
        <Text style={styles.secondaryButtonText}>Voltar ao início</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={18} color="#1B98F5" />
        <Text style={styles.infoText}>
          Limite-se a descrever sintomas leves. Não substitui uma consulta
          profissional.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F4F7FB",
  },
  headerWrapper: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
  iconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3D62",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#3F536C",
    maxWidth: "85%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#3F536C",
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#BFC8CF",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F9FBFD",
    fontSize: 14,
    color: "#0A3D62",
    maxHeight: 150,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  inputHint: {
    fontSize: 12,
    color: "#3F536C",
    fontStyle: "italic",
  },
  primaryButton: {
    backgroundColor: "#1B98F5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  emergencyButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0A3D62",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: "#0A3D62",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
  infoCard: {
    backgroundColor: "#E3F5FF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#0A3D62",
    marginLeft: 12,
    flex: 1,
  },
  resultHeader: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  urgencyBadgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3D62",
  },
  summarySection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 6,
  },
  summaryContent: {
    fontSize: 13,
    color: "#3F536C",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 16,
  },
  recommendationsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1B98F5",
    marginRight: 10,
    marginTop: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: "#3F536C",
    flex: 1,
    lineHeight: 20,
  },
  disclaimerCard: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  disclaimerIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#664D03",
    flex: 1,
    lineHeight: 18,
  },
});
