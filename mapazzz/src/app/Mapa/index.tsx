import React, { useRef, useState, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, Image, Text, ScrollView, Modal, Alert } from "react-native";
import MapView, { MAP_TYPES, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TextInput } from "react-native";
import { Search, MapPin, Layers } from "lucide-react-native";
import { router, Link, usePathname } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from "expo-file-system";


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface FooterItemProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
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
let logado = false;
export default function TelaMapa() {
  
  const [token, setToken] = useState("");
  const checkToken = async () => {
    try {
      const tokenT = await AsyncStorage.getItem('BearerToken'); // Chave usada para salvar o token
      if (tokenT) {
        console.log('Token encontrado:', tokenT);
        setToken(tokenT)
        logado = true;
        // Adicione aqui qualquer lógica para quando o token existir
      } else {
        console.log('Token não encontrado!');
        logado = false;
        // Redirecione o usuário para login ou exiba uma mensagem de erro
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
  const [locations, setLocations] = useState([]);
  const [localImages, setLocalImages] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const getDownloadableLink = (googleDriveLink) => {
    const fileId = googleDriveLink.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const downloadImage = async (imageUrl, id) => {
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
    const updatedImages = {};
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
  const getDirectImageLink = (googleDriveLink) => {
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const handleGetCurrentLocation = async () => {
    try {
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
    try {
      const res = await fetch("https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/analisar_aria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ariaDeRisco }),
      });
  
      // Aguarda a resolução da Promise e obtém os dados da resposta
      const data = await res.json();
      if(!res.ok)
        Alert.alert("ja interagiu com essa aria de Risco");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchConfirmationCount = async (ariaDeRiscoId: string) => {
    try {
      const response = await fetch(
        `https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/buscar_analise_total?ariaDeRisco=${ariaDeRiscoId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Erro ao acessar a API.");
      
      const data = await response.json();
      return data.confirmationCount;
    } catch (error) {
      console.error("Erro na requisição:", error);
      return 0; // Se algo der errado, assume 0 confirmações
    }
  };
  
  const fetchDataAndCreateCircles = async () => {
    try {
      const response = await fetch(
        "https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/buscar_aria_de_risco",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) throw new Error("Erro ao acessar a API.");
  
      const data = await response.json();
      // Para cada área de risco, buscamos o número de confirmações
      const updatedLocations = await Promise.all(
        data.map(async (location) => {
          const confirmationCount = await fetchConfirmationCount(location.id);
          return { ...location, confirmationCount };
        })
      );
  
      setLocations(updatedLocations); // Atualiza o estado com os resultados
    } catch (error) {
      console.error("Erro na requisição:", error);
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

  async function  logout()
  {
   try {
     await AsyncStorage.removeItem("BearerToken");
     console.log("Token removido com sucesso!");
     router.push("/Login"); // ou qualquer rota que deseje redirecionar
   } catch (error) {
     console.error("Erro ao remover o token:", error);
   }
  }
  
 
  checkToken();
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
            
            {Array.isArray(locations) && locations.length > 0 ? (
    locations.map((location, index) => {
      // Definir a cor com base no número de confirmações
      let circleColor = "rgba(255, 0, 0, 0.1)"; // Cor padrão (vermelha clara)
      if (location.confirmationCount > 10) {
        circleColor = "rgba(255, 0, 0, 0.7)"; // Alta confirmação (vermelho forte)
      } else if (location.confirmationCount > 5) {
        circleColor = "rgba(255, 165, 0, 0.5)"; // Média confirmação (laranja)
      } else if (location.confirmationCount > 0) {
        circleColor = "rgba(0, 255, 0, 0.3)"; // Baixa confirmação (verde claro)
      }

      return (
        <Circle
          key={index}
          center={{
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
          }}
          radius={100}
          strokeWidth={2}
          strokeColor="rgb(240, 6, 6)"
          fillColor={circleColor}
        />
      );
    })
  ) : (
  <></> // ou algum tipo de feedback para o usuário
)}
            </MapView>
            <TouchableOpacity
              style={styles.openPanelButton}
              onPress={toggleModal}
            >
              <Text style={styles.openPanelButtonText}>Areas de Risco Recentes</Text>
            </TouchableOpacity>

            {logado ? (<><TouchableOpacity
              style={styles.openPanelButton1}
              onPress={logout}
            >
              <Text style={styles.openPanelButtonText}>Logout</Text>
            </TouchableOpacity></>):(<></>)}
            

          

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
          title="MAPA"
          icon={
            <Ionicons
              name={pathname === "/" ? "map" : "map-outline"}
              size={24}
              color="black"
            />
          }
          isActive={pathname === "/"}
          onPress={() => router.push("/")}
        />
      </View>

      <TouchableOpacity  onPress={token ? (() => {router.push(`/camera?latitude=${lantitude}&longitude=${longitude}`)}) : () => {router.push("/Login")}}>
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
              name={
                pathname === "/aprender"
                  ? "game-controller"
                  : "game-controller-outline"
              }
              size={24}
              color="black"
            />
          }
          isActive={pathname === "/aprender"}
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
  {Array.isArray(locations) && locations.length > 0 ? (
    locations.map((location) => (
      <View key={location.id} style={styles.panelItem}>
        <Image
          source={{
            uri: getDirectImageLink(location.imagem),
          }}
          style={styles.panelImage}
          onError={(error) =>
            console.error("Erro ao carregar imagem:", error.nativeEvent.error)
          }
        />
        <View style={styles.panelTextContainer}>
          <Text style={styles.panelDescription}>
            Chuvas frequentes: {location.chuva}
          </Text>
          <Text style={styles.panelDescription}>
            Temperatura muito Alta: {location.temperatura}
          </Text>
          <Text style={styles.panelDescription}>
            Tempo que a área está em risco: {location.tempo}
          </Text>
          <Text style={styles.panelDescription}>
            Local: {location.enderecoFormatado}
          </Text>

          {/* Botão de confirmação */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirmarRisco(location.id)}
          >
            <Text style={styles.confirmButtonText}>Confirmar que é uma área de risco</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))
  ) : (
    <Text>Nenhuma informação disponível.</Text>
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
  confirmButton:
  {
    backgroundColor:"green",
    padding:5,
    borderRadius:5
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
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  panelItem: {
    flexDirection: "column", // Alinha os itens verticalmente
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  panelImage: {
    width: screenWidth * 0.9,
    height: 200,
    borderRadius: 10,
    marginBottom: 10, // Espaço entre a imagem e o texto
  },
  panelTextContainer: {
    alignItems: "flex-start", // Alinha o texto à esquerda
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor:"rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
  },
  panelDescription: {
    fontSize: 14,
    color: "black",
    marginBottom: 5, // Espaço entre as linhas de texto
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  panelDescription: {
    fontSize: 14,
    color: "white",
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
});
