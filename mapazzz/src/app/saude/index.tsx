import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {
  Text,
  Surface,
  Button,
  Card,
  TextInput,
  Chip,
  Divider,
  Banner,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { analyzeHealthSymptomsWithGemini, SymptomAnalysisResult } from "@/src/services/gemini";
import { getCategoryById } from "@/src/constants/reportCategories";
import { appColors } from "@/src/config/theme";

type UrgencyLevel = "baixa" | "moderada" | "alta";

const urgencyConfig = {
  baixa: { color: appColors.urgencyLow, label: "Baixa", icon: "checkmark-circle" },
  moderada: { color: appColors.urgencyMedium, label: "Moderada", icon: "information-circle" },
  alta: { color: appColors.urgencyHigh, label: "Alta", icon: "alert" },
};

export default function HealthAssistantScreen() {
  const theme = useTheme();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const healthCategory = getCategoryById("saude");

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, descreva seus sintomas antes de prosseguir.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeHealthSymptomsWithGemini(symptoms);
      setResult(analysisResult);
      setShowResult(true);
    } catch (error) {
      console.error("Erro ao analisar sintomas:", error);
      Alert.alert("Erro", "Não foi possível analisar seus sintomas. Tente novamente.");
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
        { text: "Entendi", onPress: () => router.push("/") },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  // ─── Results view ───
  if (showResult && result) {
    const urgency = urgencyConfig[result.urgencyLevel];

    return (
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen options={{ title: "Análise de Sintomas" }} />

        {/* Urgency header */}
        <View style={styles.resultHeader}>
          <Chip
            mode="flat"
            style={[styles.urgencyChip, { backgroundColor: urgency.color }]}
            textStyle={{ color: "#fff", fontWeight: "700", fontSize: 12 }}
          >
            {urgency.label}
          </Chip>
          <Text variant="headlineSmall" style={[styles.resultTitle, { color: theme.colors.onSurface }]}>
            Resultado da Análise
          </Text>
        </View>

        {/* Summary Card */}
        <Card mode="elevated" style={styles.resultCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <Surface
                style={[styles.urgencyIconCircle, { backgroundColor: urgency.color }]}
                elevation={0}
              >
                <Ionicons name={urgency.icon as any} size={24} color="#fff" />
              </Surface>
              <View style={styles.summaryContent}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                  Avaliação Preliminar
                </Text>
                <Text variant="bodySmall" style={[styles.summaryText, { color: theme.colors.onSurfaceVariant }]}>
                  {result.summary}
                </Text>
              </View>
            </View>

            <Divider style={styles.resultDivider} />

            <Text variant="titleSmall" style={[styles.recTitle, { color: theme.colors.onSurface }]}>
              Recomendações
            </Text>
            {result.recommendations.map((rec: string, index: number) => (
              <View key={index} style={styles.recItem}>
                <View style={[styles.recBullet, { backgroundColor: theme.colors.primary }]} />
                <Text variant="bodySmall" style={[styles.recText, { color: theme.colors.onSurfaceVariant }]}>
                  {rec}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Disclaimer */}
        <Surface style={[styles.disclaimerCard, { backgroundColor: theme.colors.errorContainer }]} elevation={0}>
          <Ionicons name="warning" size={16} color={theme.colors.error} />
          <Text variant="bodySmall" style={[styles.disclaimerText, { color: theme.colors.onErrorContainer }]}>
            Esta é uma triagem automática e não substitui uma consulta médica profissional.
          </Text>
        </Surface>

        {result.urgencyLevel === "alta" && (
          <Button
            mode="contained"
            icon="phone"
            onPress={handleEmergency}
            style={styles.emergencyBtn}
            contentStyle={styles.btnContent}
            buttonColor={appColors.urgencyHigh}
            textColor="#fff"
          >
            Chamar Emergência (112)
          </Button>
        )}

        <Button
          mode="contained"
          icon="refresh"
          onPress={handleReset}
          style={styles.primaryBtn}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          Nova Análise
        </Button>

        <Button
          mode="outlined"
          icon="home"
          onPress={() => router.push("/")}
          style={styles.outlinedBtn}
          contentStyle={styles.btnContent}
          labelStyle={[styles.btnLabel, { color: theme.colors.onSurface }]}
        >
          Voltar ao início
        </Button>
      </ScrollView>
    );
  }

  // ─── Input view ───
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: "Saúde & Primeiros Socorros" }} />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <Surface
          style={[styles.iconBadge, { backgroundColor: (healthCategory?.highlightColor || appColors.health) + '18' }]}
          elevation={0}
        >
          <Ionicons name="medkit" size={28} color={healthCategory?.highlightColor || appColors.health} />
        </Surface>
        <Text variant="headlineSmall" style={[styles.screenTitle, { color: theme.colors.onSurface }]}>
          Saúde & Primeiros Socorros
        </Text>
        <Text variant="bodyMedium" style={[styles.screenSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Receba orientação imediata para sintomas e emergências leves.
        </Text>
      </View>

      {/* Symptoms Card */}
      <Card mode="elevated" style={styles.symptomsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
            Descreva seus sintomas
          </Text>
          <Text variant="bodySmall" style={[styles.cardHint, { color: theme.colors.onSurfaceVariant }]}>
            Forneça detalhes para uma melhor avaliação:
          </Text>

          <TextInput
            mode="outlined"
            placeholder="Ex: Dor de cabeça, febre acima de 38ºC, tosse seca..."
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={5}
            editable={!isAnalyzing}
            style={styles.textArea}
            outlineStyle={styles.textAreaOutline}
            theme={{ roundness: 14 }}
          />

          <Text variant="labelSmall" style={[styles.inputHint, { color: theme.colors.onSurfaceVariant }]}>
            Inclua duração dos sintomas, intensidade e qualquer informação relevante.
          </Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Button
        mode="contained"
        icon={isAnalyzing ? undefined : "flask"}
        onPress={handleAnalyzeSymptoms}
        disabled={isAnalyzing}
        loading={isAnalyzing}
        style={styles.primaryBtn}
        contentStyle={styles.btnContent}
        labelStyle={styles.btnLabel}
      >
        {isAnalyzing ? "Analisando..." : "Analisar Sintomas"}
      </Button>

      <Button
        mode="contained"
        icon="alert"
        onPress={handleEmergency}
        style={styles.emergencyBtn}
        contentStyle={styles.btnContent}
        buttonColor={appColors.urgencyHigh}
        textColor="#fff"
        labelStyle={styles.btnLabel}
      >
        Emergência Médica
      </Button>

      <Button
        mode="outlined"
        icon="home"
        onPress={() => router.push("/")}
        style={styles.outlinedBtn}
        contentStyle={styles.btnContent}
        labelStyle={[styles.btnLabel, { color: theme.colors.onSurface }]}
      >
        Voltar ao início
      </Button>

      {/* Info Banner */}
      <Surface style={[styles.infoCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
        <Ionicons name="information-circle" size={18} color={theme.colors.primary} />
        <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.onPrimaryContainer }]}>
          Limite-se a descrever sintomas leves. Não substitui uma consulta profissional.
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },

  /* ─── Header ─── */
  headerWrapper: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  screenTitle: {
    fontWeight: "700",
  },
  screenSubtitle: {
    marginTop: 8,
    lineHeight: 22,
    maxWidth: "85%",
  },

  /* ─── Symptoms Card ─── */
  symptomsCard: {
    borderRadius: 20,
    marginBottom: 24,
  },
  cardHint: {
    marginTop: 4,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: "transparent",
    marginBottom: 8,
    minHeight: 120,
  },
  textAreaOutline: {
    borderRadius: 14,
  },
  inputHint: {
    fontStyle: "italic",
  },

  /* ─── Buttons ─── */
  primaryBtn: {
    borderRadius: 100,
    marginBottom: 12,
  },
  emergencyBtn: {
    borderRadius: 100,
    marginBottom: 12,
  },
  outlinedBtn: {
    borderRadius: 100,
    marginBottom: 20,
  },
  btnContent: {
    height: 52,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  /* ─── Info Card ─── */
  infoCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },

  /* ─── Results ─── */
  resultHeader: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  urgencyChip: {
    marginBottom: 12,
  },
  resultTitle: {
    fontWeight: "700",
  },
  resultCard: {
    borderRadius: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  urgencyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  summaryContent: {
    flex: 1,
  },
  summaryText: {
    marginTop: 4,
    lineHeight: 20,
  },
  resultDivider: {
    marginBottom: 16,
  },
  recTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  recBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 7,
  },
  recText: {
    flex: 1,
    lineHeight: 20,
  },
  disclaimerCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  disclaimerText: {
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
});
