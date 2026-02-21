import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  Pressable,
  StatusBar,
} from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W = SCREEN_W * 0.82;
const CARD_H = SCREEN_H * 0.52;

interface Maravilha {
  id: string;
  nome: string;
  regiao: string;
  descricao: string;
  imagem: any;
  cor: string;
}

const MARAVILHAS: Maravilha[] = [
  {
    id: "1",
    nome: "Quedas de Calandula",
    regiao: "Malanje",
    descricao:
      "As segundas maiores quedas de água de África, com 105 metros de altura e 400 metros de largura. Um espetáculo da natureza angolana que atrai visitantes do mundo inteiro.",
    imagem: require("@/assets/7-maravi/calandula.jpg"),
    cor: "#1B5E20",
  },
  {
    id: "2",
    nome: "Fenda da Tundavala",
    regiao: "Huíla",
    descricao:
      "Uma fenda gigantesca com mais de 1.000 metros de profundidade na Serra da Leba. Uma paisagem de cortar a respiração entre o planalto e o deserto do Namibe.",
    imagem: require("@/assets/7-maravi/tundavala.jpg"),
    cor: "#BF360C",
  },
  {
    id: "3",
    nome: "Floresta do Maiombe",
    regiao: "Cabinda",
    descricao:
      "A segunda maior floresta tropical do mundo, rica em biodiversidade e lar de gorilas, chimpanzés e centenas de espécies raras.",
    imagem: require("@/assets/7-maravi/maiombe.jpg"),
    cor: "#004D40",
  },
  {
    id: "4",
    nome: "Monte Moco",
    regiao: "Huambo",
    descricao:
      "O ponto mais alto de Angola com 2.620 metros. Um destino de alpinismo que oferece vistas panorâmicas de tirar o fôlego sobre o planalto central.",
    imagem: require("@/assets/7-maravi/moco.jpg"),
    cor: "#4E342E",
  },
  {
    id: "5",
    nome: "Grutas do Nzenzo",
    regiao: "Uíge",
    descricao:
      "Formações geológicas impressionantes com estalactites e estalagmites formadas ao longo de milhares de anos. Um tesouro subterrâneo único em África.",
    imagem: require("@/assets/7-maravi/nzenzo.jpg"),
    cor: "#1A237E",
  },
  {
    id: "6",
    nome: "Pedras Negras de Carumbo",
    regiao: "Lunda Norte",
    descricao:
      "Formações rochosas misteriosas e monumentais que se erguem da savana. Um cenário surreal que conta a história geológica milenar de Angola.",
    imagem: require("@/assets/7-maravi/carumbo.jpg"),
    cor: "#37474F",
  },
  {
    id: "7",
    nome: "Quedas do Rio Chiumbe",
    regiao: "Moxico",
    descricao:
      "Cascatas deslumbrantes rodeadas de vegetação exuberante no coração remoto de Angola. Um paraíso escondido de águas cristalinas.",
    imagem: require("@/assets/7-maravi/chiumbe.jpg"),
    cor: "#0D47A1",
  },
];

function FadeInCard({
  item,
  index,
  onPress,
}: {
  item: Maravilha;
  index: number;
  onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Pressable onPress={onPress}>
        <View style={cardStyles.card}>
          <Image source={item.imagem} style={cardStyles.image} />
          <View style={cardStyles.gradient} />
          <View style={cardStyles.badge}>
            <Ionicons name="diamond" size={10} color="#FFD700" />
            <Text style={cardStyles.badgeText}>{index + 1}ª Maravilha</Text>
          </View>
          <View style={cardStyles.info}>
            <Text style={cardStyles.nome}>{item.nome}</Text>
            <View style={cardStyles.regiaoRow}>
              <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={cardStyles.regiao}>{item.regiao}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function MaravilhasScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Start playing music on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
        const { sound: s } = await Audio.Sound.createAsync(
          require("@/assets/7-maravi/jeniffer_tavira_nova_angola_mp3_13857.mp3"),
          { shouldPlay: true, isLooping: true, volume: 0.5 }
        );
        if (mounted) {
          setSound(s);
          setIsPlaying(true);
        }
      } catch (e) {
        console.warn("Erro ao carregar música:", e);
      }
    })();

    return () => {
      mounted = false;
      sound?.unloadAsync();
    };
  }, []);

  const toggleMusic = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0A0E1A" }]}>
      <StatusBar barStyle="light-content" />

      {/* ─── Header ─── */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={22}
          onPress={() => router.back()}
          style={styles.backBtn}
        />
        <View style={styles.headerCenter}>
          <Ionicons name="diamond" size={18} color="#FFD700" />
          <Text style={styles.headerTitle}>7 Maravilhas de Angola</Text>
        </View>
        <IconButton
          icon={isPlaying ? "music-note" : "music-note-off"}
          iconColor={isPlaying ? "#FFD700" : "rgba(255,255,255,0.4)"}
          size={22}
          onPress={toggleMusic}
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero text ─── */}
        <Animated.View
          style={[
            styles.heroSection,
            { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <Text style={styles.heroTitle}>Descubra Angola</Text>
          <Text style={styles.heroSubtitle}>
            Sete tesouros naturais que fazem de Angola uma das nações mais belas do
            continente africano.
          </Text>
        </Animated.View>

        {/* ─── Cards ─── */}
        {MARAVILHAS.map((m, i) => (
          <React.Fragment key={m.id}>
            <FadeInCard
              item={m}
              index={i}
              onPress={() => toggleExpand(m.id)}
            />
            {expanded === m.id && (
              <Animated.View style={styles.expandedCard}>
                <Surface style={[styles.descriptionSurface, { backgroundColor: m.cor + "E6" }]} elevation={2}>
                  <Text style={styles.descriptionText}>{m.descricao}</Text>
                  <View style={styles.descriptionDivider} />
                  <View style={styles.descriptionMeta}>
                    <Ionicons name="compass" size={14} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.descriptionMetaText}>
                      Província de {m.regiao}, Angola
                    </Text>
                  </View>
                </Surface>
              </Animated.View>
            )}
          </React.Fragment>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 24,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  info: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  nome: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  regiaoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  regiao: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  backBtn: {},
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 28,
    marginBottom: 28,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  expandedCard: {
    paddingHorizontal: (SCREEN_W - CARD_W) / 2,
    marginTop: -12,
    marginBottom: 20,
  },
  descriptionSurface: {
    borderRadius: 20,
    padding: 20,
  },
  descriptionText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 22,
  },
  descriptionDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 14,
  },
  descriptionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  descriptionMetaText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
});
