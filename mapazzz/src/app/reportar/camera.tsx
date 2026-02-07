import React, { useEffect, useMemo, useRef, useState } from "react";import React, { useEffect, useRef, useState } from "react";


















































































































































































































































































































































































































































































































































































































































});  },    marginRight: 8,  inlineIcon: {  },    fontWeight: "600",    color: "#fff",  submitButtonText: {  },    flex: 1,    paddingHorizontal: 16,    paddingVertical: 12,    borderRadius: 30,    backgroundColor: "#0A3D62",    justifyContent: "center",    alignItems: "center",    flexDirection: "row",  submitButton: {  },    fontWeight: "600",    color: "#0A3D62",  secondaryButtonText: {  },    flex: 1,    marginRight: 12,    paddingHorizontal: 16,    paddingVertical: 12,    borderRadius: 30,    backgroundColor: "#E3F5FF",    justifyContent: "center",    alignItems: "center",    flexDirection: "row",  secondaryButton: {  },    marginBottom: 28,    justifyContent: "space-between",    alignItems: "center",    flexDirection: "row",  actionsRow: {  },    marginBottom: 16,    fontSize: 12,    color: "#E74C3C",  locationError: {  },    marginTop: 4,    color: "#3F536C",    fontSize: 12,  locationDescription: {  },    color: "#0A3D62",    fontWeight: "600",    fontSize: 14,  locationTitle: {  },    marginBottom: 12,    padding: 16,    borderRadius: 16,    backgroundColor: "#fff",    alignItems: "flex-start",    flexDirection: "row",  locationCard: {  },    backgroundColor: "#fff",    textAlignVertical: "top",    minHeight: 80,    padding: 12,    borderRadius: 10,    borderColor: "#D0D9E6",    borderWidth: 1,  textArea: {  },    overflow: "hidden",    borderRadius: 10,    borderColor: "#D0D9E6",    borderWidth: 1,  pickerWrapper: {  },    marginBottom: 6,    color: "#3F536C",    fontSize: 13,  inputLabel: {  },    marginBottom: 14,  inputGroup: {  },    marginBottom: 12,    color: "#0A3D62",    fontWeight: "600",    fontSize: 16,  sectionTitle: {  },    marginBottom: 20,    padding: 16,    borderRadius: 16,    backgroundColor: "#fff",  formSection: {  },    marginBottom: 4,    fontSize: 12,    color: "#3F536C",  analysisTip: {  },    marginBottom: 8,    fontSize: 13,    color: "#3F536C",  analysisConfidence: {  },    lineHeight: 18,    fontSize: 13,    color: "#3F536C",  analysisDescription: {  },    marginBottom: 6,    color: "#0A3D62",    fontWeight: "600",    fontSize: 16,  analysisTitle: {  },    shadowOffset: { width: 0, height: 6 },    shadowRadius: 12,    shadowOpacity: 0.1,    shadowColor: "#0A3D62",    elevation: 3,    marginBottom: 20,    padding: 16,    borderRadius: 16,    backgroundColor: "#fff",  analysisCard: {  },    marginBottom: 16,    borderRadius: 16,    height: 240,    width: "100%",  previewImage: {  },    padding: 20,  resultContainer: {  },    backgroundColor: "#FF6B3C",    borderRadius: 28,    height: 56,    width: 56,  captureInner: {  },    marginTop: 24,    backgroundColor: "rgba(10,61,98,0.25)",    justifyContent: "center",    alignItems: "center",    borderColor: "rgba(255,255,255,0.8)",    borderWidth: 6,    borderRadius: 42,    height: 84,    width: 84,  captureButton: {  },    backgroundColor: "rgba(0,0,0,0.4)",    justifyContent: "center",    alignItems: "center",    borderColor: "rgba(255,255,255,0.6)",    borderWidth: 1,    borderRadius: 20,    height: 40,    width: 40,  switchButton: {  },    alignItems: "flex-end",    justifyContent: "flex-start",    padding: 16,    flex: 1,  cameraOverlay: {  },    overflow: "hidden",    borderRadius: 20,    height: "70%",    width: "90%",  camera: {  },    paddingBottom: 32,    justifyContent: "center",    alignItems: "center",    flex: 1,  cameraWrapper: {  },    marginBottom: 24,    lineHeight: 20,    fontSize: 14,    textAlign: "center",    color: "#E3F5FF",  permissionText: {  },    marginBottom: 12,    fontWeight: "700",    fontSize: 20,    color: "#fff",  permissionTitle: {  },    backgroundColor: "#0A3D62",    paddingHorizontal: 32,    justifyContent: "center",    alignItems: "center",    flex: 1,  permissionContainer: {  },    backgroundColor: "#F6F8FB",    flex: 1,  container: {const styles = StyleSheet.create({}  );    </View>      )}        </View>          </TouchableOpacity>            <View style={styles.captureInner} />          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>          </CameraView>            </View>              </TouchableOpacity>                <Ionicons name="camera-reverse" size={20} color="#fff" />              >                }                  setCameraFacing((prev) => (prev === "back" ? "front" : "back"))                onPress={() =>                style={styles.switchButton}              <TouchableOpacity            <View style={styles.cameraOverlay}>          >            enableTorch={false}            facing={cameraFacing}            style={styles.camera}            ref={cameraRef}          <CameraView        <View style={styles.cameraWrapper}>      ) : (        </ScrollView>          </View>            </TouchableOpacity>              )}                </>                  <Text style={styles.submitButtonText}>Enviar ocorrência</Text>                  <Ionicons name="paper-plane" size={16} color="#fff" style={styles.inlineIcon} />                <>              ) : (                <ActivityIndicator color="#fff" />              {isSubmitting ? (            >              disabled={isSubmitting}              onPress={handleSubmit}              style={styles.submitButton}            <TouchableOpacity            </TouchableOpacity>              <Text style={styles.secondaryButtonText}>Tirar outra foto</Text>              <Ionicons name="camera-reverse" size={16} color="#0A3D62" style={styles.inlineIcon} />            <TouchableOpacity style={styles.secondaryButton} onPress={retakePhoto}>          <View style={styles.actionsRow}>          ) : null}            <Text style={styles.locationError}>{locationError}</Text>          {locationError ? (          </View>            </View>              </Text>                {address ?? "Estamos a localizar o endereço..."}              <Text style={styles.locationDescription}>              <Text style={styles.locationTitle}>Localização detectada</Text>            <View style={{ marginLeft: 12 }}>            <Ionicons name="pin" size={18} color="#1B98F5" />          <View style={styles.locationCard}>          </View>            })}              );                </View>                  />                    placeholder="Escreva aqui"                    onChangeText={(text) => updateFormValue(question.id, text)}                    value={formValues[question.id] ?? ""}                    multiline                    style={styles.textArea}                  <TextInput                  <Text style={styles.inputLabel}>{question.label}</Text>                <View key={question.id} style={styles.inputGroup}>              return (              }                );                  </View>                    </View>                      </Picker>                        ))}                          <Picker.Item key={option} label={option} value={option} />                        {question.options.map((option) => (                        <Picker.Item label="Seleccione" value="" />                      >                        }                          updateFormValue(question.id, value)                        onValueChange={(value) =>                        selectedValue={formValues[question.id] ?? ""}                      <Picker                    <View style={styles.pickerWrapper}>                    <Text style={styles.inputLabel}>{question.label}</Text>                  <View key={question.id} style={styles.inputGroup}>                return (              if (question.type === "select") {            {config.questions.map((question) => {            <Text style={styles.sectionTitle}>Informe os detalhes</Text>          <View style={styles.formSection}>          ) : null}            </View>              ))}                </Text>                  • {tip}                <Text key={index} style={styles.analysisTip}>              {analysis.recommendations?.map((tip: string, index: number) => (              </Text>                Confiança estimada: {(analysis.confidence * 100).toFixed(0)}%              <Text style={styles.analysisConfidence}>              <Text style={styles.analysisTitle}>{analysis.classification}</Text>            <View style={styles.analysisCard}>          ) : analysis ? (            </View>              </Text>                Estamos a confirmar a categoria e a sugerir próximos passos.              <Text style={styles.analysisDescription}>              <Text style={styles.analysisTitle}>A analisar evidência...</Text>              <ActivityIndicator size="small" color="#1B98F5" />            <View style={styles.analysisCard}>          {isAnalyzing ? (          <Image source={{ uri: capturedUri }} style={styles.previewImage} />        <ScrollView contentContainerStyle={styles.resultContainer}>      {capturedUri ? (    <View style={styles.container}>  return (  }    );      </View>        </TouchableOpacity>          <Text style={styles.primaryButtonText}>Conceder permissão</Text>        >          onPress={requestCameraPermission}          style={styles.primaryButton}        <TouchableOpacity        </Text>          Autorize o acesso à câmara para capturar evidências da ocorrência.        <Text style={styles.permissionText}>        <Text style={styles.permissionTitle}>Precisamos da sua permissão</Text>      <View style={styles.permissionContainer}>    return (  if (!cameraPermission.granted) {  }    return null;  if (!cameraPermission) {  };    }      setIsSubmitting(false);    } finally {      Alert.alert("Erro", error.message ?? "Não foi possível registar a ocorrência.");    } catch (error: any) {      );        [{ text: "OK", onPress: () => router.push("/") }]        "A ocorrência foi registada e será analisada pelas equipas responsáveis.",        "Sucesso",      Alert.alert(      });        analysis,        mediaUrl: evidenceUrl,        longitude: coordinates.longitude,        latitude: coordinates.latitude,        enderecoFormatado: address,        prioridade: formValues.prioridade,        impacto,        descricao,        categoria: config.key,      await submitOccurrence({        formValues.impacto || formValues.feridos || formValues.sintomas;      const impacto =        formValues.descricao || formValues.sintomas || "Sem descrição detalhada";      const descricao =      }        return;        );          "Não foi possível carregar a evidência. Tente novamente."          "Erro",        Alert.alert(      if (!evidenceUrl) {      const evidenceUrl = await uploadEvidence(capturedUri);    try {    setIsSubmitting(true);    }      return;      );        "Responda todas as perguntas para continuarmos."        "Formulário incompleto",      Alert.alert(    if (emptyField) {    const emptyField = Object.entries(formValues).find(([, value]) => !value);    }      return;      Alert.alert("Registo incompleto", "Capture uma imagem antes de enviar.");    if (!capturedUri) {  const handleSubmit = async () => {  };    setFormValues((prev) => ({ ...prev, [field]: value }));  const updateFormValue = (field: string, value: string) => {  };    setAnalysis(null);    setCapturedUri(null);  const retakePhoto = () => {  };    }      setIsAnalyzing(false);    } finally {      console.warn("Falha na análise de IA", error);    } catch (error) {      setAnalysis(result);      const result = await analyzeEvidence(config.key);      setIsAnalyzing(true);    try {  const runAnalysis = async () => {  };    }      Alert.alert("Erro", "Não foi possível capturar a foto. Tente novamente.");      console.error("Erro ao capturar imagem", error);    } catch (error) {      await runAnalysis();      setCapturedUri(photo.uri);      });        quality: 0.7,      const photo = await cameraRef.current.takePictureAsync({    try {    }      return;    if (!cameraRef.current) {  const handleCapture = async () => {  }, []);    requestLocation();    };      }        setLocationError("Não foi possível obter a localização actual.");        console.warn("Não foi possível obter a localização", error);      } catch (error) {        setAddress(formattedAddress);          .join(", ");          .filter(Boolean)        ]          addressInfo.region,          addressInfo.subregion,          addressInfo.street,        const formattedAddress = [        });          longitude: currentPosition.coords.longitude,          latitude: currentPosition.coords.latitude,        const [addressInfo] = await Location.reverseGeocodeAsync({        });          longitude: currentPosition.coords.longitude,          latitude: currentPosition.coords.latitude,        setCoordinates({        });          accuracy: Location.Accuracy.Balanced,        const currentPosition = await Location.getCurrentPositionAsync({        }          return;          setLocationError("Permissão de localização negada.");        if (status !== "granted") {        const { status } = await Location.requestForegroundPermissionsAsync();      try {    const requestLocation = async () => {  useEffect(() => {  }, [config]);    setFormValues(initialValues);    }, {});      return acc;      acc[question.id] = "";    const initialValues = config.questions.reduce<FormValue>((acc, question) => {  useEffect(() => {  const [locationError, setLocationError] = useState<string | null>(null);  const [address, setAddress] = useState<string | undefined>();  const [coordinates, setCoordinates] = useState(defaultCoordinates);  const [formValues, setFormValues] = useState<FormValue>({});  const [isSubmitting, setIsSubmitting] = useState(false);  const [isAnalyzing, setIsAnalyzing] = useState(false);  const [analysis, setAnalysis] = useState<any>(null);  const [capturedUri, setCapturedUri] = useState<string | null>(null);  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");  const [cameraPermission, requestCameraPermission] = useCameraPermissions();  const cameraRef = useRef<CameraView | null>(null);  }, [categoryKey]);    return { key: "infraestrutura" as CategoryKey, ...CATEGORY_FORM.infraestrutura };    }      return { key, ...CATEGORY_FORM[key] };    if (CATEGORY_FORM[key]) {    const key = categoryKey as CategoryKey;  const config = useMemo(() => {  const categoryKey = (params.categoria ?? "infraestrutura").toLowerCase();  const params = useLocalSearchParams<{ categoria?: string }>();export default function ReportCameraScreen() {};  longitude: 0,  latitude: 0,const defaultCoordinates = {type FormValue = Record<string, string>;type CategoryKey = keyof typeof CATEGORY_FORM;};  },    ],      },        options: ["Urgente", "Precisa de análise", "Monitorizar"],        type: "select",        label: "Como classifica a urgência?",        id: "prioridade",      {      },        type: "text",        label: "Existe alguma orientação médica recebida?",        id: "descricao",      {      },        type: "text",        label: "Quais os principais sintomas observados?",        id: "sintomas",      {    questions: [    label: "Saúde Pública",  saude: {  },    ],      },        options: ["Emergência", "Alta", "Média"],        type: "select",        label: "Qual a urgência percebida?",        id: "prioridade",      {      },        type: "text",        label: "Conte-nos o que aconteceu",        id: "descricao",      {      },        options: ["Não", "Sim, já socorridos", "Sim, a precisar de ajuda"],        type: "select",        label: "Há feridos no local?",        id: "feridos",      {    questions: [    label: "Segurança & Emergências",  seguranca: {  },    ],      },        options: ["Crítico", "Moderado", "Baixo"],        type: "select",        label: "Qual o nível de urgência?",        id: "prioridade",      {      },        type: "text",        label: "Descreva o problema",        id: "descricao",      {      },        options: ["Sim", "Parcialmente", "Não"],        type: "select",        label: "O problema impede a circulação?",        id: "impacto",      {    questions: [    label: "Infraestrutura Urbana",  infraestrutura: {const CATEGORY_FORM = {} from "@/src/services/reportService";  uploadEvidence,  submitOccurrence,  analyzeEvidence,import {import { Ionicons } from "@expo/vector-icons";import AsyncStorage from "@react-native-async-storage/async-storage";import { Picker } from "@react-native-picker/picker";import * as Location from "expo-location";import { CameraView, CameraType, useCameraPermissions } from "expo-camera";import { useLocalSearchParams, router } from "expo-router";} from "react-native";  ScrollView,  TextInput,  ActivityIndicator,  Image,  Alert,  TouchableOpacity,  StyleSheet,  Text,  View,import {import {
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

function buildInitialAnswers(category: SupportedCategory) {
  return questionBank[category].reduce<Record<string, string>>((acc, q) => {
    acc[q.id] = "";
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
  const [answers, setAnswers] = useState<Record<string, string>>(
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
          "https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/postar_aria",
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
      "https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/upload",
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
