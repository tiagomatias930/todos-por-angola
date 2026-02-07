import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  getCategoryById,
  reportCategories,
} from "@/src/constants/reportCategories";

const guidanceByCategory: Record<string, string[]> = {
  infraestrutura: [
    "Fotografe o problema com nitidez e inclua referência de escala (ex: carro, pessoa).",
    "Descreva se a situação causa bloqueio total ou parcial da via.",
    "Informe há quanto tempo o problema persiste e se já existe reporte na área.",
  ],
  seguranca: [
    "Garanta a sua segurança primeiro antes de registar o incidente.",
    "Informe se há feridos e se já contactou as autoridades locais.",
    "Partilhe detalhes que ajudem a acionar os serviços correctos (polícia, bombeiros).",
  ],
};

export default function ReportCategoryScreen() {
  const params = useLocalSearchParams();
  const category = getCategoryById(params.category);

  if (!category || category.id === "mapa" || category.id === "saude") {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Reportes" }} />
        <Text style={styles.title}>Categoria indisponível</Text>
        <Text style={styles.subtitle}>
          Escolha uma das opções disponíveis na página inicial.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.primaryButtonText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recommendations = guidanceByCategory[category.id] || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: category.title }} />
      <View style={styles.headerWrapper}>
        <View style={styles.iconBadge}>
          <Ionicons name={category.icon as any} size={28} color="#fff" />
        </View>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.subtitle}>{category.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Como preparar o reporte</Text>
        {recommendations.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={18} color="#16A085" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
        <Text style={styles.disclaimer}>
          Os dados recolhidos são encaminhados para as equipas responsáveis e
          ajudam a criar inteligência urbana para as autoridades angolanas.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/reportar/camera",
            params: { category: category.id },
          })
        }
      >
        <Ionicons name="camera" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.primaryButtonText}>Capturar evidência</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/Mapa")}
      >
        <Ionicons name="map" size={18} color="#0A3D62" style={styles.icon} />
        <Text style={styles.secondaryButtonText}>Ver ocorrências próximas</Text>
      </TouchableOpacity>
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
  },
  iconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0A3D62",
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
  },
  card: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 14,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipText: {
    marginLeft: 8,
    color: "#3F536C",
    flex: 1,
  },
  disclaimer: {
    marginTop: 12,
    fontSize: 12,
    color: "#7A869A",
  },
  primaryButton: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B3C",
    paddingVertical: 14,
    borderRadius: 30,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F5FF",
    paddingVertical: 14,
    borderRadius: 30,
  },
  secondaryButtonText: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});
