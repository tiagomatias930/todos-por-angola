import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Text,
  Surface,
  Button,
  Card,
  List,
  Divider,
  useTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  getCategoryById,
  reportCategories,
} from "@/src/constants/reportCategories";
import { appColors } from "@/src/config/theme";

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
  const theme = useTheme();
  const params = useLocalSearchParams();
  const category = getCategoryById(params.category);

  if (!category || category.id === "mapa" || category.id === "saude") {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen options={{ title: "Reportes" }} />
        <Surface style={styles.emptyCard} elevation={1}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.onSurfaceVariant} />
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            Categoria indisponível
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: "center" }}>
            Escolha uma das opções disponíveis na página inicial.
          </Text>
          <Button
            mode="contained"
            icon="home"
            onPress={() => router.push("/")}
            style={styles.homeButton}
            contentStyle={styles.buttonContent}
          >
            Voltar ao início
          </Button>
        </Surface>
      </View>
    );
  }

  const recommendations = guidanceByCategory[category.id] || [];
  const catColor = category.highlightColor || appColors.infrastructure;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: category.title }} />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <Surface
          style={[styles.iconBadge, { backgroundColor: catColor + "18" }]}
          elevation={0}
        >
          <Ionicons name={category.icon as any} size={28} color={catColor} />
        </Surface>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
          {category.title}
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {category.description}
        </Text>
      </View>

      {/* Guidance Card */}
      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
            Como preparar o reporte
          </Text>
          <Divider style={styles.divider} />
          {recommendations.map((tip, index) => (
            <List.Item
              key={index}
              title={tip}
              titleNumberOfLines={3}
              titleStyle={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}
              left={() => (
                <View style={[styles.tipIcon, { backgroundColor: appColors.infrastructure + "18" }]}>
                  <Ionicons name="checkmark" size={14} color={appColors.infrastructure} />
                </View>
              )}
              style={styles.tipItem}
            />
          ))}
          <Text variant="bodySmall" style={[styles.disclaimer, { color: theme.colors.outline }]}>
            Os dados recolhidos são encaminhados para as equipas responsáveis e ajudam a criar inteligência urbana para as autoridades angolanas.
          </Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Button
        mode="contained"
        icon="camera"
        onPress={() =>
          router.push({
            pathname: "/reportar/camera",
            params: { category: category.id },
          })
        }
        style={styles.primaryButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        buttonColor={theme.colors.tertiary}
        textColor="#fff"
      >
        Capturar evidência
      </Button>

      <Button
        mode="outlined"
        icon="map-marker-radius"
        onPress={() => router.push("/Mapa")}
        style={styles.secondaryButton}
        contentStyle={styles.buttonContent}
        labelStyle={[styles.buttonLabel, { color: theme.colors.onSurface }]}
        theme={{ roundness: 100 }}
      >
        Ver ocorrências próximas
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
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
  title: {
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    borderRadius: 20,
    marginBottom: 28,
  },
  divider: {
    marginVertical: 12,
  },
  tipItem: {
    paddingVertical: 2,
    paddingLeft: 0,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimer: {
    marginTop: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  primaryButton: {
    borderRadius: 100,
    marginBottom: 12,
  },
  secondaryButton: {
    borderRadius: 100,
  },
  buttonContent: {
    height: 52,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  emptyCard: {
    borderRadius: 28,
    padding: 40,
    alignItems: "center",
    margin: 20,
    marginTop: 60,
  },
  homeButton: {
    marginTop: 24,
    borderRadius: 100,
  },
});
