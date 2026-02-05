import React, { useState, useRef, useEffect } from "react";
import { ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Button,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import Questionario from "@/src/components/Questionario";
import { styles } from "./style";
import { json } from "stream/consumers";
import { ListOrdered } from "lucide-react-native";
import { useSearchParams } from "expo-router/build/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

// URL do seu servidor
const API_URL = 'https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/upload';  // Substitua pelo seu URL de produção

const Camera_expo = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);
  const [fotada, setFotada] = useState(false);
  const router = useRouter();
  const [imagemuri, setImagemuri] = useState("");
  const [latitude, longitude] = useSearchParams();
  const [chuva, setChuva] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [tempo, setTempo] = useState('');
  const [local, setLocal] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para exibir o progress bar


  
  let lat = latitude ? parseFloat(latitude[1]) : 0;
  let log = longitude?  parseFloat(longitude[1]) : 0;
    
 
  useEffect(() => {
    if (!galleryPermission?.granted) {
      requestGalleryPermission();
    }
  }, [galleryPermission]);

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Precisamos de permissão para acessar a câmera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "blue", marginTop: 10 }}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function trocarCamera() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  async function capturarFoto() {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: false,
      });

      console.log("📸 Foto capturada:", photo.uri);
      salvarNaGaleria(photo.uri);
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    }
  }

  async function salvarNaGaleria(uri: string) {
    try {
      setImagemuri(uri);
      setFotada(true);
    } catch (error) {
      console.error("Erro ao salvar na galeria:", error);
    }
  }

  function resetfoto() {
    setFotada(false);
  }

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('BearerToken'); // Substitua pela chave usada
      return token; // Retorna o token armazenado
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
      return null;
    }
  };

  async function uploadImageToServer(uri: string) {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: uri, // URI do arquivo
        name: "foto-upload.jpg", // Nome do arquivo enviado
        type: "image/jpeg", // Tipo MIME do arquivo
      });

      const response = await fetch("https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/upload", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json', // Aceitar JSON do servidor
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.json}`);
      }

      const data = await response.json();
      console.log('Arquivo enviado com sucesso:', data);
      return data.link || null; // Trabalhe apenas com `fileId` ou dados simples
    } catch (error) {
      console.error("Erro ao enviar a imagem para o servidor:", error);
      Alert.alert("Erro", "Não foi possível enviar a imagem.");
      return null;
    }
  }

  async function registar_aria_de_risco(imagem: String, chuva: String, temperatura: String, tempo: String, enderecoFormatado: String) {
    const token = await getToken();
    console.log(enderecoFormatado);
    const response = await fetch("https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/postar_aria", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        'Content-Type': 'application/json', // Cabeçalho para JSON, se necessário
      },
      body: JSON.stringify({ imagem, chuva, temperatura, tempo, enderecoFormatado, lat, log })
    });

    const result = await response.json();
    if (!response.ok)
      Alert.alert("Error", result.message);
    else
      router.push("/");
  }

  const { width, height } = Dimensions.get("window");
  let lar = width;
  let hal = height;
  return (
    <>
    

      {fotada ? (
        <View style={{ width:lar, height:hal, flex: 1 }}>
          <View style={{ alignItems: "center", height:"20%", margin:"3%"}}>
            <Image source={{ uri: imagemuri }} style={styles.imagem} />
          </View>
          <View style={{height:"10%"}}>
          <Button title="Tirar nova foto" onPress={resetfoto} />
          </View>
          <View style={style.painel}>
            <Text style={style.titolo}>Questionaria sobre a Aria de Risco</Text>
            <View style={style.aria_text}>
              <Text style={style.text_normal}>1. A chuva é frequente nesta área?</Text>
              <Picker
                style={style.checkbox}
                selectedValue={chuva}
                onValueChange={(itemValue) => setChuva(itemValue)}
              >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Sim" value="SIM" />
                <Picker.Item label="Não" value="NÃO" />
              </Picker>
            </View>
            <View style={style.aria_text}>
              <Text style={style.text_normal}>2. A temperatura é muito alta nesta área?</Text>
              <Picker
                style={style.checkbox}
                selectedValue={temperatura}
                onValueChange={(itemValue) => setTemperatura(itemValue)}
              >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Sim" value="SIM" />
                <Picker.Item label="Não" value="NÃO" />
              </Picker>
            </View>
            <View style={style.aria_text}>
              <Text style={style.text_normal}>3. Por quanto tempo você tem notado essa área afetada?</Text>
              <TextInput style={style.textbox} placeholder="Exemplo: 2 meses" value={tempo} onChangeText={setTempo} />
            </View>
            <View style={style.aria_text}>
              <Text style={style.text_normal}>4. Local?</Text>
              <TextInput style={style.textbox} placeholder="Nome do Local" value={local} onChangeText={setLocal} />
            </View>
          </View>

          <Button
  title={isLoading ? "Enviando..." : "Enviar Resposta"}
  onPress={async () => {
    setIsLoading(true); // Ativa o progress bar
    console.log("Processando...");

    const fileId = await uploadImageToServer(imagemuri);
    if (fileId) {
      await registar_aria_de_risco(fileId, chuva, temperatura, tempo, local);
    } else {
      Alert.alert("Erro", "Não foi possível enviar a imagem.");
    }
    setIsLoading(false); // Desativa o progress bar
  }}
/>
        </View>
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <CameraView ref={cameraRef} style={{ flex: 1, alignItems:"center" }} facing={facing} >

          <TouchableOpacity onPress={capturarFoto} style={style.tirar}>
          </TouchableOpacity>
          </CameraView>
        </SafeAreaView>
      )}
      {isLoading && (
  <View style={style.loadingContainer}>
    <ActivityIndicator  size="300" color="#FFF00" />
    <Text>Enviando resposta...</Text>
  </View>
)}
    </>
  );
};

export const style = StyleSheet.create({
  tirar:{
    width:100,
    height:100,
    backgroundColor:"rgba(8, 151, 218, 0.5)",
    borderRadius:100,
    marginBottom:20,
    borderColor:"rgba(0, 240, 40, 0.5)",
    borderWidth:5,
    position:"absolute",
    bottom:0,

  },
  loadingContainer: {
    position: "absolute",
    width:Dimensions.get("window").width,
    height:Dimensions.get("window").height,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor:"rgba(0, 0, 0, 0.52)"
    
  },
  painel:
  {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "silver",
    borderWidth: 1,
  },
  titolo:
  {
    fontSize: 15,
    fontFamily: "Arial",
    textAlign: "center",
    marginBottom: "3%",
    margin: 10,
  },
  checkbox:
  {
    borderRadius: 5,
    padding: "2%",
    color: "black",
    borderColor: "silver",
    backgroundColor: "transparent",
  },
  textbox:
  {
    borderRadius: 10,
    padding: "2%",
    margin: 2,
    borderColor: "silver",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 20
  },
  aria_text:
  {
    width: 300,
    padding: "2%",
  },
  text_normal:
  {
    marginBottom: 10,
  }
});

export default Camera_expo;
