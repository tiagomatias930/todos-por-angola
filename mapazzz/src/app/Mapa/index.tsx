import React, { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text, ScrollView, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { MAP_TYPES, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TextInput } from "react-native";
import { Search, MapPin, Layers } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from "expo-file-system/legacy";
import { reportCategories } from "@/src/constants/reportCategories";
import { ENV } from "@/src/config/env";


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface FooterItemProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}

type ReportCategoryFilter = "todas" | "infraestrutura" | "seguranca" | "saude";

interface MapLocation {
  id: string;
  latitude: string;
  longitude: string;
  chuva?: string;
  temperatura?: string;
  tempo?: string;
  enderecoFormatado?: string;
  imagem?: string;
  confirmationCount?: number;
  categoria?: "infraestrutura" | "seguranca" | "saude";
}

const circleFillColors: Record<Exclude<ReportCategoryFilter, "todas">, string> = {
  infraestrutura: "rgba(22, 160, 133, 0.35)",
  seguranca: "rgba(255, 107, 60, 0.35)",
  saude: "rgba(27, 152, 245, 0.35)",
};

const circleStrokeColors: Record<Exclude<ReportCategoryFilter, "todas">, string> = {
  infraestrutura: "rgba(22, 160, 133, 0.7)",
  seguranca: "rgba(255, 107, 60, 0.7)",
  saude: "rgba(27, 152, 245, 0.7)",
};

const filterChips: Array<{ id: ReportCategoryFilter; label: string }> = [
  { id: "todas", label: "Todas" },
  { id: "infraestrutura", label: "Infraestrutura" },
  { id: "seguranca", label: "Segurança" },
  { id: "saude", label: "Saúde" },
];

function inferCategoryFromLocation(
  location: MapLocation,
): Exclude<ReportCategoryFilter, "todas"> {
  if (location.categoria) {
    return location.categoria;
  }

  const searchable = (
    `${location.enderecoFormatado ?? ""} ${location.chuva ?? ""} ${location.temperatura ?? ""} ${location.tempo ?? ""}`
  ).toLowerCase();

  if (
    searchable.includes("hospital") ||
    searchable.includes("saude") ||
    searchable.includes("saúde") ||
    searchable.includes("clinica") ||
    searchable.includes("clínica") ||
    searchable.includes("posto medico") ||
    searchable.includes("posto de saude")
  ) {
    return "saude";
  }

  if (
    searchable.includes("assalto") ||
    searchable.includes("crime") ||
    searchable.includes("perigo") ||
    searchable.includes("roubo") ||
    searchable.includes("seguranca") ||
    searchable.includes("segurança") ||
    searchable.includes("violencia") ||
    searchable.includes("violência")
  ) {
    return "seguranca";
  }

  return "infraestrutura";
}

function getCategoryMetadata(categoryId?: string) {
  const fallback =
    reportCategories.find((item) => item.id === "infraestrutura") ??
    reportCategories[0];

  if (!categoryId) {
    return fallback;
  }

  return reportCategories.find((item) => item.id === categoryId) ?? fallback;
}

const FooterItem: React.FC<FooterItemProps> = ({
  title,
  icon,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.customButton,
        isActive ? styles.activeButton : styles.inactiveButton,
      ]}
      onPress={onPress}
    >
      {icon}
      <Text
        style={[
          styles.buttonText,

        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export default function TelaMapa() {
  const [token, setToken] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<
    "todas" | "infraestrutura" | "seguranca" | "saude"
  >("todas");

  const checkToken = async () => {
    try {
      const tokenT = await AsyncStorage.getItem('BearerToken');
      if (tokenT) {
        setToken(tokenT);
        setIsLogged(true);
      } else {
        setToken(null);
        setIsLogged(false);
      }
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
    }
  };
  const pathname = usePathname();
  const [user, setUser] = useState("");
  const mapRef = useRef<MapView>(null);
  const [viewMap, setViewMap] = useState<any>("standard");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [longitude, setLongitude] = useState(0);
  const [lantitude, setLantitude] = useState(0);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [localImages, setLocalImages] = useState<Record<string, string>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const displayedLocations = useMemo(() => {
    if (categoryFilter === "todas") {
      return locations;
    }
    return locations.filter((location) => location.categoria === categoryFilter);
  }, [locations, categoryFilter]);

  
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const getDownloadableLink = (googleDriveLink: string) => {
    const fileId = googleDriveLink.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const downloadImage = async (imageUrl: string, id: string) => {
    try {
      const downloadableLink = getDownloadableLink(imageUrl);
      const fileUri = `${FileSystem.documentDirectory}${id}.jpg`;

      const { uri } = await FileSystem.downloadAsync(downloadableLink, fileUri);
      return uri;
    } catch (error) {
      console.error("Erro ao baixar a imagem:", error);
      return null;
    }
  };

  const downloadAllImages = async () => {
    const updatedImages: Record<string, string> = {};
    for (const location of locations) {
      if (location.imagem) {
        const localUri = await downloadImage(location.imagem, location.id);
        if (localUri) {
          updatedImages[location.id] = localUri;
        }
      }
    }
    setLocalImages(updatedImages);
  };
  const getDirectImageLink = (googleDriveLink: string) => {
    try {
      const fileId = googleDriveLink.split("/d/")[1]?.split("/")[0];
      if (!fileId) {
        console.error("Link inválido do Google Drive:", googleDriveLink);
        return null;
      }
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    } catch (error) {
      console.error("Erro ao processar o link do Google Drive:", error);
      return null;
    }
  };

  // const zonesInDanger = [
  //   { id: "1", name: "Zona Central" },
  //   { id: "2", name: "Bairro Industrial" },
  //   { id: "3", name: "Região Litorânea" },
  // ];

  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      if (location) {
        const { latitude, longitude } = location.coords;
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
        setLantitude(latitude);
        setLongitude(longitude);
      }
    } catch (error) {
      console.log("Error getting location:", error);
      setErrorMsg("Could not get your current location");
    }
  };

  const toggleMapType = () => {
    setViewMap(
      viewMap === MAP_TYPES.STANDARD ? MAP_TYPES.SATELLITE : MAP_TYPES.STANDARD
    );
  };

  const handleSearch = async () => {
    if (user.trim() === "") return;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão para acessar a localização negada");
        return;
      }
      const results = await Location.geocodeAsync(user);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          },
          1000
        );
        setLantitude(latitude);
        setLongitude(longitude);
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function handleConfirmarRisco(ariaDeRisco: string) {
    if (!isLogged) {
      router.push("/Login");
      return;
    }

    try {
      const res = await fetch(
        `${ENV.API_BASE_URL}/analisar_aria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ariaDeRisco }),
        },
      );

      const text = await res.text();
      if (!text || text.trimStart().startsWith("<")) {
        Alert.alert("Erro", "Servidor indisponível. Tente novamente mais tarde.");
        return;
      }
      const data = JSON.parse(text);
      if (!res.ok) {
        Alert.alert(
          "Aviso",
          data?.message ?? "Você já confirmou esta ocorrência recentemente.",
        );
        return;
      }

      Alert.alert(
        "Obrigado",
        "A sua confirmação ajuda-nos a priorizar as equipas responsáveis.",
      );
      console.log(data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível registar a confirmação. Tente novamente mais tarde.",
      );
    }
  }
  const fetchConfirmationCount = async (ariaDeRiscoId: string) => {
    try {
      const response = await fetch(
        `${ENV.API_BASE_URL}/buscar_analise_total?ariaDeRisco=${ariaDeRiscoId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`Erro ao acessar a API (${response.status})`);

      const text = await response.text();
      if (!text || text.trimStart().startsWith("<")) {
        console.warn("API retornou HTML em vez de JSON (confirmação)");
        return 0;
      }
      const data = JSON.parse(text);
      return data.confirmationCount;
    } catch (error) {
      console.error("Erro na requisição (confirmação):", error);
      return 0; // Se algo der errado, assume 0 confirmações
    }
  };
  
  const fetchDataAndCreateCircles = async () => {
    try {
      const response = await fetch(
        `${ENV.API_BASE_URL}/buscar_aria_de_risco`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) throw new Error(`Erro ao acessar a API (${response.status})`);

      const text = await response.text();
      if (!text || text.trimStart().startsWith("<")) {
        console.warn("Backend indisponível (túnel serveo expirado?). O mapa será exibido sem ocorrências.");
        setLocations([]);
        return;
      }
      const data = JSON.parse(text);
      const updatedLocations: MapLocation[] = await Promise.all(
        data.map(async (location: MapLocation) => {
          const confirmationCount = await fetchConfirmationCount(location.id);
          const categoria = location.categoria ?? inferCategoryFromLocation(location);
          return { ...location, confirmationCount, categoria };
        })
      );

      setLocations(updatedLocations);
    } catch (error) {
      console.warn("Erro na requisição (backend offline?):", error);
      setLocations([]);
    }
  };
  useEffect(() => {
    const run = async () => {
      await handleGetCurrentLocation();
      await checkToken();
      await fetchDataAndCreateCircles();
      // await downloadAllImages();
    };
    run();
  }, []);

  async function logout() {
    try {
      await AsyncStorage.removeItem("BearerToken");
      setToken(null);
      setIsLogged(false);
      router.push("/Login");
    } catch (error) {
      console.error("Erro ao remover o token:", error);
    }
  }
  
 
  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mapContainer}>
          <View style={styles.topSearchContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                value={user}
                onChangeText={(text) => setUser(text)}
                onSubmitEditing={handleSearch}
                placeholder="Pesquisar por zonas"
                style={styles.searchInput}
              />
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.searchIcon}
              >
                <Search size={18} color={"#158ADD"} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
            >
              {filterChips.map((chip) => {
                const active = categoryFilter === chip.id;
                return (
                  <TouchableOpacity
                    key={chip.id}
                    style={[
                      styles.filterChip,
                      active && styles.filterChipActive,
                    ]}
                    onPress={() => setCategoryFilter(chip.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        active && styles.filterChipTextActive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <MapView
            ref={mapRef}
            style={styles.map}
            mapType={viewMap}
            showsUserLocation={true}
            showsMyLocationButton={false}
            initialRegion={{
              latitude: lantitude,
              longitude: longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
          >
            
            {displayedLocations.length > 0
              ? displayedLocations.map((location, index) => {
                  const category = location.categoria ?? "infraestrutura";
                  const fillColor =
                    circleFillColors[category] || circleFillColors.infraestrutura;
                  const strokeColor =
                    circleStrokeColors[category] || circleStrokeColors.infraestrutura;
                  const baseRadius = 120;
                  const radius = baseRadius + (location.confirmationCount ?? 0) * 6;

                  return (
                    <Circle
                      key={`${location.id}-${index}`}
                      center={{
                        latitude: parseFloat(location.latitude),
                        longitude: parseFloat(location.longitude),
                      }}
                      radius={radius}
                      strokeWidth={2}
                      strokeColor={strokeColor}
                      fillColor={fillColor}
                    />
                  );
                })
              : null}
            </MapView>
            <TouchableOpacity
              style={styles.openPanelButton}
              onPress={toggleModal}
            >
              <Text style={styles.openPanelButtonText}>Areas de Risco Recentes</Text>
            </TouchableOpacity>

            {isLogged ? (
              <TouchableOpacity style={styles.openPanelButton1} onPress={logout}>
                <Text style={styles.openPanelButtonText}>Terminar sessão</Text>
              </TouchableOpacity>
            ) : null}
            

          

          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={handleGetCurrentLocation}
            >
              <MapPin size={16} color={"black"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapButton} onPress={toggleMapType}>
              <Layers size={16} color={"black"} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
    <View style={styles.footer}>
      <View style={styles.buttonWrapper}>
        <FooterItem
          title="INÍCIO"
          icon={
            <Ionicons
              name={pathname === "/" ? "home" : "home-outline"}
              size={24}
              color="black"
            />
          }
          isActive={pathname === "/"}
          onPress={() => router.push("/")}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (!isLogged) {
            router.push("/Login");
            return;
          }

          router.push({
            pathname: "/reportar/camera",
            params: {
              category: "infraestrutura",
              latitude: String(lantitude ?? 0),
              longitude: String(longitude ?? 0),
            },
          });
        }}
      >
          <Image
            source={require("../../../assets/images/button_alert.png")}
            style={{
              width: Dimensions.get("window").width * 0.2,
              height: Dimensions.get("window").width * 0.2,
              top: -Dimensions.get("window").width * 0.1,
              borderRadius: 100,
              backgroundColor: "transparent",
            }}
          />
      </TouchableOpacity>

      <View style={styles.buttonWrapper}>
        <FooterItem
          title="APRENDER"
          icon={
            <Ionicons
              name={pathname.includes("Aprender") ? "game-controller" : "game-controller-outline"}
              size={24}
              color="black"
            />
          }
          isActive={pathname.includes("Aprender")}
          onPress={() => router.push("/Aprender/aprender")}
        />
      </View>
    </View>
    <Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Painel de Informações</Text>
      <ScrollView>
        {displayedLocations.length > 0 ? (
          displayedLocations.map((location) => {
            const metadata = getCategoryMetadata(location.categoria);
            const imageUri = location.imagem
              ? getDirectImageLink(location.imagem)
              : null;
            return (
              <View key={location.id} style={styles.panelItem}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.panelImage}
                  />
                ) : (
                  <View style={styles.panelImagePlaceholder}>
                    <Ionicons name="image" size={24} color="#0A3D62" />
                    <Text style={styles.panelPlaceholderText}>Sem imagem</Text>
                  </View>
                )}
                <View style={styles.panelTextContainer}>
                  <View style={styles.panelHeaderRow}>
                    <View
                      style={[
                        styles.categoryPill,
                        { backgroundColor: metadata.highlightColor },
                      ]}
                    >
                      <Ionicons
                        name={metadata.icon as any}
                        size={14}
                        color="white"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.categoryPillText}>{metadata.title}</Text>
                    </View>
                    <Text style={styles.panelConfirmation}>
                      {(location.confirmationCount ?? 0)} validações
                    </Text>
                  </View>
                  <Text style={styles.panelAddress}>
                    {location.enderecoFormatado || "Endereço não informado"}
                  </Text>
                  {location.tempo ? (
                    <Text style={styles.panelDescription}>
                      Última atualização: {location.tempo}
                    </Text>
                  ) : null}
                  {location.chuva ? (
                    <Text style={styles.panelDescription}>
                      Impacto relatado: {location.chuva}
                    </Text>
                  ) : null}
                  {location.temperatura ? (
                    <Text style={styles.panelDescription}>
                      Observação adicional: {location.temperatura}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleConfirmarRisco(location.id)}
                  >
                    <Text style={styles.confirmButtonText}>
                      Confirmar ocorrência
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Nenhuma ocorrência disponível.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  confirmButton: {
    marginTop: 14,
    backgroundColor: "#0A3D62",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topSearchContainer: {
    position: "absolute",
    top: "5%",
    zIndex: 50,
    width: "100%",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#BFC8CF",
    borderRadius: 20,
    backgroundColor: "white",
  },
  searchInput: {
    flex: 1,
    padding: 12,
    paddingLeft: 20,
  },
  searchIcon: {
    position: "absolute",
    right: 16,
  },
  filterScroll: {
    marginTop: 12,
  },
  filterScrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  filterChip: {
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0D8E2",
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "white",
  },
  filterChipActive: {
    backgroundColor: "#0A3D62",
    borderColor: "#0A3D62",
  },
  filterChipText: {
    color: "#0A3D62",
    fontWeight: "500",
    fontSize: 12,
  },
  filterChipTextActive: {
    color: "white",
  },
  bottomButtonsContainer: {
    position: "absolute",
    bottom: 30,
    right: 16,
    zIndex: 50,
    flexDirection: "column",
    gap: 12,
  },
  mapButton: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    shadowColor: "black",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeContainer: {
    flexDirection: "row",
    gap: 6,
    padding: 16,
    justifyContent: "space-around",
  },
  mapTypeButton: {
    backgroundColor: "green",
    width: 70,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  mapTypeImage: {
    width: 70,
    height: 50,
    borderRadius: 8,
  },
  zoneContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  zoneItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#BFC8CF",
  },
  footer: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: "black",
    backgroundColor: "white",
  },
  buttonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width* 0.25,
    height: Dimensions.get("window").width * 0.25,
  },
  customButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: Dimensions.get("window").width * 0.15,
    height: Dimensions.get("window").width * 0.15,
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonText: {
    fontSize: 10,
    color: "black",
  },
  inactiveButtonText: {
    fontWeight: "normal",
  },
  activeButtonText: {
    fontWeight: "bold",
  },
  openPanelButton: {
    position: "absolute",
    top: 100,
    right: 16,
    backgroundColor: "#158ADD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  openPanelButton1: {
    position: "absolute",
    top: 150,
    right: 16,
    backgroundColor: "#158ADD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  openPanelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  panelItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F4F7FB",
  },
  panelImage: {
    width: "100%",
    height: 180,
  },
  panelTextContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  panelHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryPillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  panelConfirmation: {
    fontSize: 12,
    color: "#3F536C",
    fontWeight: "600",
  },
  panelAddress: {
    fontSize: 14,
    color: "#0A3D62",
    fontWeight: "600",
    marginBottom: 6,
  },
  panelDescription: {
    fontSize: 13,
    color: "#3F536C",
    marginBottom: 4,
  },
  panelImagePlaceholder: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F5FF",
  },
  panelPlaceholderText: {
    marginTop: 6,
    color: "#3F536C",
    fontSize: 12,
  },
  closeButton: {
    backgroundColor: "#158ADD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: "#3F536C",
  },
});
