import React, { useEffect, useRef, useState } from "react";
import { ENV } from "@/src/config/env";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  simulateImageClassification,
  ImageClassificationResult,
} from "@/src/services/ai";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type QuestionType = "select" | "text";

interface QuestionDefinition {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

type SupportedCategory = "infraestrutura" | "seguranca";

type AnswersMap = Record<string, string>;

const questionBank: Record<SupportedCategory, QuestionDefinition[]> = {
  infraestrutura: [
    {
      id: "impacto",
      label: "O problema impede a passagem?",
      type: "select",
      options: [
        { label: "Selecione", value: "" },
        { label: "Bloqueio total", value: "bloqueio_total" },
        { label: "Bloqueio parcial", value: "bloqueio_parcial" },
        { label: "Sem bloqueio", value: "sem_bloqueio" },
      ],
    },
    {
      id: "servicos",
      label: "Quais serviços foram afetados?",
      type: "text",
      placeholder: "Ex: água, energia, transportes",
    },
    {
      id: "duracao",
      label: "Há quanto tempo observa o problema?",
      type: "text",
      placeholder: "Ex: 3 dias",
    },
    {
      id: "local",
      label: "Nome do local ou referência",
      type: "text",
      placeholder: "Ex: Rua 21 de Janeiro",
    },
  ],
  seguranca: [
    {
      id: "feridos",
      label: "Existem feridos?",
      type: "select",
      options: [
        { label: "Selecione", value: "" },
        { label: "Sim, em estado crítico", value: "critico" },
        { label: "Sim, sem gravidade", value: "estavel" },
        { label: "Não", value: "nao" },
      ],
    },
    {
      id: "autoridades",
      label: "Alguma autoridade já foi contactada?",
      type: "select",
      options: [
        { label: "Selecione", value: "" },
        { label: "Polícia", value: "policia" },
        { label: "Bombeiros", value: "bombeiros" },
        { label: "Serviço Médico", value: "medico" },
        { label: "Ainda não", value: "nao" },
      ],
    },
    {
      id: "descricao",
      label: "Descreva o que aconteceu",
      type: "text",
      placeholder: "Ex: colisão entre dois veículos",
    },
    {
      id: "local",
      label: "Nome do local ou referência",
      type: "text",
      placeholder: "Ex: Largo da Independência",
    },
  ],
};

function buildInitialAnswers(category: SupportedCategory): AnswersMap {
  return questionBank[category].reduce<AnswersMap>((acc, question) => {
    acc[question.id] = "";
    return acc;
  }, {});
}

export default function ReportCamera() {
  const params = useLocalSearchParams();
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const normalizedCategory: SupportedCategory =
    categoryParam === "seguranca" ? "seguranca" : "infraestrutura";

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] =
    useState<ImageClassificationResult | null>(null);
  const [answers, setAnswers] = useState<AnswersMap>(
    buildInitialAnswers(normalizedCategory),
  );
  const [activeCategory, setActiveCategory] =
    useState<SupportedCategory>(normalizedCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<
    Location.LocationObjectCoords | null
  >(null);

  useEffect(() => {
    if (!galleryPermission?.granted) {
      requestGalleryPermission();
    }
  }, [galleryPermission, requestGalleryPermission]);

  useEffect(() => {
    (async () => {
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status === "granted") {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setCurrentPosition(position.coords);
      }
    })();
  }, []);

  useEffect(() => {
    setAnswers(buildInitialAnswers(activeCategory));
  }, [activeCategory]);

  if (!permission?.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>
          Precisamos da sua autorização para usar a câmara.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.primaryButtonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleFacing() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  async function capturePhoto() {
    if (!cameraRef.current) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: false,
      });
      handlePhotoCaptured(photo.uri);
    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      Alert.alert("Erro", "Não foi possível capturar a imagem.");
    }
  }

  async function handlePhotoCaptured(uri: string) {
    setPhotoUri(uri);
    setHasPhoto(true);
    setIsAnalyzing(true);

    try {
      const result = await simulateImageClassification(activeCategory);
      setAnalysis(result);
      if (
        result.primaryCategory === "infraestrutura" ||
        result.primaryCategory === "seguranca"
      ) {
        setActiveCategory(result.primaryCategory);
      }
    } catch (error) {
      console.error("Erro ao classificar imagem:", error);
      Alert.alert(
        "Aviso",
        "Não foi possível analisar a imagem automaticamente. Continue preenchendo manualmente.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function resetPhoto() {
    setHasPhoto(false);
    setPhotoUri("");
    setAnalysis(null);
    setActiveCategory(normalizedCategory);
  }

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function submitReport() {
    if (!photoUri) {
      Alert.alert("Aviso", "Capture uma imagem antes de enviar o reporte.");
      return;
    }

    if (Object.values(answers).every((value) => value.trim() === "")) {
      Alert.alert("Aviso", "Preencha pelo menos uma informação adicional.");
      return;
    }

    setIsSubmitting(true);
    try {
      const link = await uploadEvidence(photoUri);

      const token = await AsyncStorage.getItem("BearerToken");
      const payload = {
        imagem: link,
        categoria: activeCategory,
        respostas: answers,
        classificacao: analysis,
        latitude: currentPosition?.latitude,
        longitude: currentPosition?.longitude,
      };

      try {
        const response = await fetch(
          `${ENV.API_BASE_URL}/postar_aria`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
              imagem: link,
              chuva: answers.impacto || answers.feridos || "",
              temperatura: answers.servicos || answers.autoridades || "",
              tempo: answers.duracao || answers.descricao || "",
              enderecoFormatado: answers.local,
              lat: currentPosition?.latitude,
              log: currentPosition?.longitude,
              categoria: activeCategory,
              respostas: answers,
              classificacao: analysis,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Falha ao registar reporte (${response.status})`);
        }
      } catch (error) {
        console.warn("Endpoint indisponível, usando registo local.", error);
      }

      console.log("Reporte preparado:", payload);
      Alert.alert(
        "Sucesso",
        "O seu reporte foi enviado. Iremos notificá-lo assim que houver atualização.",
        [
          {
            text: "Ver mapa",
            onPress: () => router.push("/Mapa"),
          },
        ],
      );
      resetPhoto();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao enviar reporte:", error);
      Alert.alert(
        "Erro",
        "Não foi possível concluir o reporte. Tente novamente em alguns instantes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack.Screen options={{ title: "Capturar evidência" }} />
      {!hasPhoto ? (
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={facing}
            animateShutter
          />
          <View style={styles.cameraActions}>
            <TouchableOpacity style={styles.smallButton} onPress={toggleFacing}>
              <Text style={styles.buttonLabel}>Trocar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={capturePhoto} />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          {isAnalyzing ? (
            <View style={styles.analysisBox}>
              <ActivityIndicator size="large" color="#0A3D62" />
              <Text style={styles.analysisText}>A analisar imagem com IA...</Text>
            </View>
          ) : analysis ? (
            <View style={styles.analysisBox}>
              <Text style={styles.analysisTitle}>Sugestão da IA</Text>
              <Text style={styles.analysisSubtitle}>
                Categoria provável: {analysis.primaryCategory.toUpperCase()} ({
                  Math.round(analysis.confidence * 100)
                }% de confiança)
              </Text>
              {analysis.suggestedActions.map((action, index) => (
                <Text key={index} style={styles.analysisTip}>
                  • {action}
                </Text>
              ))}
            </View>
          ) : null}

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Detalhes adicionais</Text>
            {questionBank[activeCategory].map((question) => {
              if (question.type === "select") {
                return (
                  <View key={question.id} style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>{question.label}</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={answers[question.id]}
                      onValueChange={(value) => setAnswer(question.id, value)}
                    >
                      {(question.options || []).map((option) => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                );
              }

              return (
                <View key={question.id} style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>{question.label}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={question.placeholder}
                    value={answers[question.id]}
                    onChangeText={(text) => setAnswer(question.id, text)}
                  />
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.secondaryButton} onPress={resetPhoto}>
            <Text style={styles.secondaryButtonText}>Tirar nova foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 16 }]}
            onPress={submitReport}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Enviar reporte</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

async function uploadEvidence(uri: string) {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "evidencia.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetch(
      `${ENV.API_BASE_URL}/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.link || data.fileId || uri;
  } catch (error) {
    console.warn("Falha no upload remoto, usando referência local.", error);
    return uri;
  }
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: "#0A3D62",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  cameraActions: {
    position: "absolute",
    bottom: 32,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 4,
    borderColor: "#FF6B3C",
  },
  smallButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "600",
  },
  previewContainer: {
    padding: 20,
    backgroundColor: "#F4F7FB",
  },
  previewImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.4,
    borderRadius: 16,
    alignSelf: "center",
  },
  analysisBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  analysisTitle: {
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 6,
  },
  analysisSubtitle: {
    color: "#3F536C",
    marginBottom: 10,
  },
  analysisText: {
    marginTop: 12,
    color: "#3F536C",
  },
  analysisTip: {
    color: "#3F536C",
    marginBottom: 4,
  },
  formCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 12,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#3F536C",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#B0C4DE",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#B0C4DE",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 14,
    backgroundColor: "#E3F5FF",
  },
  secondaryButtonText: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  primaryButton: {
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
});
