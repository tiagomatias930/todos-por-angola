import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Text,
  Surface,
  Button,
  Card,
  Chip,
  useTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  reportCategories,
  ReportCategory,
} from "@/src/constants/reportCategories";
import { appColors } from "@/src/config/theme";

const screen = Dimensions.get("window");

export default function HomeDashboard() {
  const theme = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("BearerToken");
        setToken(storedToken);
      } catch (error) {
        console.error("Erro ao verificar o token:", error);
      } finally {
        setLoadingToken(false);
      }
    };
    checkToken();
  }, []);

  const heroCta = useMemo(() => {
    if (loadingToken) return "A preparar a sua experiência...";
    return token
      ? "Obrigado por fazer parte da Angola Conectada. Explore as funcionalidades abaixo."
      : "Crie a sua conta ou inicie sessão para participar activamente na transformação da sua comunidade.";
  }, [loadingToken, token]);

  const categoryColors: Record<string, string> = {
    saude: appColors.health,
    seguranca: appColors.security,
    infraestrutura: appColors.infrastructure,
    mapa: appColors.map,
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Chip
              compact
              mode="flat"
              style={[styles.overlineChip, { backgroundColor: theme.colors.primaryContainer }]}
              textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 11, fontWeight: "600" }}
            >
              Plataforma GovTech
            </Chip>
            <Text
              variant="headlineLarge"
              style={[styles.title, { color: theme.colors.primary }]}
            >
              Nova Angola
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Empoderamos cada cidadão a reportar, validar e resolver desafios
              urbanos com apoio de inteligência artificial.
            </Text>
          </View>
        </View>

        {/* ─── Hero Card ─── */}
        <Surface style={[styles.heroCard, { backgroundColor: theme.colors.primary }]} elevation={3}>
          <View style={styles.heroIconRow}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="megaphone" size={22} color={theme.colors.primary} />
            </View>
          </View>
          <Text variant="titleLarge" style={styles.heroTitle}>
            Seja a voz da sua comunidade
          </Text>
          <Text variant="bodyMedium" style={styles.heroDescription}>
            {heroCta}
          </Text>

          {!token && !loadingToken && (
            <View style={styles.authActions}>
              <Button
                mode="contained"
                icon="login"
                onPress={() => router.push("/Login")}
                style={styles.authButton}
                contentStyle={styles.authButtonContent}
                labelStyle={styles.authButtonLabel}
                buttonColor="#FFFFFF"
                textColor={theme.colors.primary}
              >
                Entrar
              </Button>
              <Button
                mode="outlined"
                icon="account-plus"
                onPress={() => router.push("/registo")}
                style={styles.authButton}
                contentStyle={styles.authButtonContent}
                labelStyle={styles.authButtonLabel}
                textColor="#FFFFFF"
                theme={{ colors: { outline: "rgba(255,255,255,0.5)" } }}
              >
                Criar Conta
              </Button>
            </View>
          )}

          <Button
            mode="contained"
            icon="bullhorn"
            onPress={() => router.push("/reportar/infraestrutura")}
            style={styles.reportButton}
            contentStyle={styles.reportButtonContent}
            labelStyle={styles.reportButtonLabel}
            buttonColor={theme.colors.tertiary}
            textColor="#FFFFFF"
          >
            Reportar Agora
          </Button>
        </Surface>

        {/* ─── Ações rápidas (só visível após login) ─── */}
        {token && (
          <>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                Ações rápidas
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}
              >
                Escolha uma categoria para começar imediatamente.
              </Text>
            </View>

            <View style={styles.cardsGrid}>
              {reportCategories.map((action: ReportCategory) => (
                <Card
                  key={action.id}
                  mode="elevated"
                  style={styles.card}
                  onPress={() => router.push(action.route as any)}
                >
                  <Card.Content style={styles.cardContent}>
                    <View
                      style={[
                        styles.cardIconWrapper,
                        {
                          backgroundColor:
                            (categoryColors[action.id] || theme.colors.primary) + "18",
                        },
                      ]}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={24}
                        color={categoryColors[action.id] || theme.colors.primary}
                      />
                    </View>
                    <Text
                      variant="titleSmall"
                      style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                    >
                      {action.title}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}
                    >
                      {action.description}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* ─── What's next ─── */}
        <Surface style={styles.comingSoonCard} elevation={1}>
          <View style={styles.comingSoonIcon}>
            <Ionicons name="rocket" size={28} color={theme.colors.primary} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            O que vem a seguir?
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.comingSoonText, { color: theme.colors.onSurfaceVariant }]}
          >
            Acompanhe o progresso das suas denúncias, receba feedback das
            autoridades e partilhe histórias de impacto.
          </Text>
        </Surface>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  header: {
    marginTop: 56,
    marginBottom: 8,
  },
  headerContent: {
    maxWidth: screen.width * 0.85,
  },
  overlineChip: {
    alignSelf: "flex-start",
    marginBottom: 12,
    borderRadius: 20,
  },
  title: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 12,
    lineHeight: 22,
  },
  heroCard: {
    marginTop: 24,
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
  },
  heroIconRow: {
    marginBottom: 16,
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
  },
  heroDescription: {
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 4,
    lineHeight: 22,
  },
  authActions: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
  },
  authButton: {
    flex: 1,
    borderRadius: 100,
  },
  authButtonContent: {
    height: 44,
  },
  authButtonLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  reportButton: {
    marginTop: 16,
    borderRadius: 100,
  },
  reportButtonContent: {
    height: 48,
  },
  reportButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionHeader: {
    marginTop: 36,
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginTop: 4,
  },
  cardsGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "47%",
    borderRadius: 20,
    marginBottom: 4,
  },
  cardContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },
  cardDescription: {
    lineHeight: 17,
  },
  comingSoonCard: {
    marginTop: 28,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  comingSoonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(21, 101, 192, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  comingSoonText: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: "90%",
  },
});