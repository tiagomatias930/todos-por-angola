import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const CATEGORY_CONFIG = {
  infraestrutura: {
    title: "Infraestrutura Urbana",
    summary:
      "Buracos, iluminação pública, água e saneamento. Recolha evidências para que as equipas de manutenção actuem rapidamente.",
    checklist: [
      "Identifique se a via está bloqueada.",
      "Garanta que a zona esteja segura para fotografar.",
      "Recolha testemunhos de moradores, se possível.",
    ],
  },
  seguranca: {
    title: "Segurança & Emergências",
    summary:
      "Acidentes viários, conflitos ou riscos imediatos. O reporte ajuda as forças de segurança a priorizar as ocorrências.",
    checklist: [
      "Verifique se há feridos e acione o 112 quando necessário.",
      "Mantenha a distância em situações de risco.",
      "Capture imagens apenas se estiver seguro.",
    ],
  },
  saude: {
    title: "Saúde Pública",
    summary:
      "Sintomas, surtos e condições sanitárias. Reúna informações fiáveis para orientar cidadãos e serviços de saúde.",
    checklist: [
      "Registe sintomas predominantes.",
      "Capture fotos de receituário ou condições sanitárias, quando permitido.",
      "Proteja dados pessoais antes de enviar.",
    ],
  },
};

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export default function ReportCategoryScreen() {
  const params = useLocalSearchParams<{ categoria?: string }>();
  const categoryKey = (params.categoria ?? "infraestrutura").toLowerCase();
  const config = useMemo(() => {
    const key = categoryKey as CategoryKey;
    if (CATEGORY_CONFIG[key]) {
      return { key, ...CATEGORY_CONFIG[key] };
    }

    return {
      key: "infraestrutura" as CategoryKey,
      title: "Ocorrência Geral",
      summary:
        "Reporte qualquer situação relevante para a comunidade. A nossa equipa ajudará a direccionar para a entidade correcta.",
      checklist: [
        "Confirme a localização exacta.",
        "Capture fotos e descreva o que está a acontecer.",
        "Indique se há risco imediato para pessoas.",
      ],
    };
  }, [categoryKey]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#0A3D62" />
        </TouchableOpacity>
        <Text style={styles.overline}>Reportar</Text>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.summary}>{config.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Antes de avançar</Text>
        {config.checklist.map((item, index) => (
          <View key={index} style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={18} color="#1B98F5" />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/reportar/camera",
            params: { categoria: config.key },
          })
        }
      >
        <Ionicons name="camera" size={18} color="#fff" style={styles.inlineIcon} />
        <Text style={styles.primaryButtonText}>Capturar evidência</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          router.push({
            pathname: "/Mapa",
            params: { filtro: config.key },
          })
        }
      >
        <Ionicons name="map" size={16} color="#0A3D62" style={styles.inlineIcon} />
        <Text style={styles.secondaryButtonText}>Ver ocorrências relacionadas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E3F5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  overline: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#3F536C",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
    marginTop: 6,
  },
  summary: {
    marginTop: 12,
    fontSize: 14,
    color: "#3F536C",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#0A3D62",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#0A3D62",
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkText: {
    marginLeft: 10,
    fontSize: 13,
    color: "#3F536C",
    flexShrink: 1,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B98F5",
    borderRadius: 30,
    paddingVertical: 14,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F5FF",
    borderRadius: 30,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  inlineIcon: {
    marginRight: 8,
  },
});
