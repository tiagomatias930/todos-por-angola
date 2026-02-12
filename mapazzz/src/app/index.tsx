import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  reportCategories,
  ReportCategory,
} from "@/src/constants/reportCategories";

const screen = Dimensions.get("window");

export default function HomeDashboard() {
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
    if (loadingToken) {
      return "A preparar a sua experiência...";
    }
    return token
      ? "Obrigado por fazer parte da Angola Conectada. Explore as funcionalidades abaixo."
      : "Crie a sua conta ou inicie sessão para participar activamente na transformação da sua comunidade.";
  }, [loadingToken, token]);

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            {/* Logo imagem<Image
            source={require("@/assets/images/logo.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />*/}
            <Text style={styles.overline}>Plataforma GovTech</Text>
            <Text style={styles.title}>Nova Angola</Text>
            <Text style={styles.subtitle}>
              Empoderamos cada cidadão a reportar, validar e resolver desafios urbanos com apoio de inteligência artificial.
            </Text>
          </View>

        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Seja a voz da sua comunidade</Text>
          <Text style={styles.heroDescription}>{heroCta}</Text>
          {!token && !loadingToken ? (
            <View style={styles.authActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/Login")}
              >
                <Ionicons
                  name="log-in"
                  size={18}
                  color="#fff"
                  style={styles.inlineIcon}
                />
                <Text style={styles.primaryButtonText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push("/registo")}
              >
                <Ionicons
                  name="person-add"
                  size={18}
                  color="#0A3D62"
                  style={styles.inlineIcon}
                />
                <Text style={styles.secondaryButtonText}>Criar Conta</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => router.push("/reportar/infraestrutura")}
          >
            <Ionicons
              name="megaphone"
              size={18}
              color="#fff"
              style={styles.inlineIcon}
            />
            <Text style={styles.reportButtonText}>Reportar Agora</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha uma categoria para começar imediatamente.
          </Text>
        </View>

        <View style={styles.cardsGrid}>
          {reportCategories.map((action: ReportCategory) => (
            <TouchableOpacity
              key={action.id}
              style={styles.card}
              onPress={() => router.push(action.route as any)}
            >
              <View style={styles.cardIconWrapper}>
                <Ionicons name={action.icon as any} size={24} color="#0A3D62" />
              </View>
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>O que vem a seguir?</Text>
          <Text style={styles.sectionSubtitle}>
            Acompanhe o progresso das suas denúncias, receba feedback das autoridades e partilhe histórias de impacto.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F2F6FF",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  header: {
    marginTop: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overline: {
    color: "#0A3D62",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "bold",
    color: "#0A3D62",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#112",
    maxWidth: screen.width * 0.55,
  },
  heroImage: {
    width: screen.width * 0.28,
    height: screen.width * 0.28,
  },
  heroCard: {
    marginTop: 32,
    backgroundColor: "#0A3D62",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#0A3D62",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  heroDescription: {
    color: "#E3F5FF",
    marginTop: 10,
    fontSize: 14,
  },
  authActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: "#1B98F5",
    borderRadius: 30,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: "#E3F5FF",
    borderRadius: 30,
  },
  secondaryButtonText: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  reportButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FF6B3C",
    borderRadius: 30,
    paddingVertical: 14,
  },
  reportButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  inlineIcon: {
    marginRight: 8,
  },
  sectionHeader: {
    marginTop: 36,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
  },
  sectionSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#3F536C",
  },
  cardsGrid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0A3D62",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E3F5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
  },
  cardDescription: {
    marginTop: 6,
    fontSize: 12,
    color: "#3F536C",
  },
});