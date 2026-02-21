import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  Surface,
  TextInput,
  IconButton,
  useTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Define interface para a estrutura das mensagens
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function TelaAprender() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Como posso ajudar você a aprender hoje?',
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Ocultar o footer quando entrar na tela e mostrar novamente ao sair
  // useEffect(() => {
  //   setFooterVisible(false);
    
  //   // Restabelecer o footer quando o componente for desmontado
  //   return () => setFooterVisible(true);
  // }, []);

  // Função para lidar com o envio de mensagem
  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    
    // Simular resposta do bot (com um pequeno atraso)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // Rolagem automática para a mensagem mais recente
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  // Gerador simples de respostas do bot
  const generateBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('oi') || input.includes('olá') || input.includes('ola')) {
      return 'Olá! Como posso ajudar você?';
    } else if (input.includes('ajuda') || input.includes('help')) {
      return 'Estou aqui para ajudar você a aprender. O que você gostaria de saber?';
    } else if (input.includes('aprender') || input.includes('estudar')) {
      return 'Posso ajudar você a aprender diversos assuntos. O que você gostaria de aprender?';
    }else if (input.includes('timatias') || input.includes('matias')) {
      return 'Timatias é um nome interessante! Você gostaria de saber mais sobre ele?';
    }
    else {
      return 'Desculpe, não entendi. Poderia reformular sua pergunta?';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* ─── Header ─── */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={22}
          onPress={() => router.back()}
          style={styles.backBtn}
        />
        <View style={styles.headerTitleRow}>
          <Surface style={styles.headerIconBg} elevation={0}>
            <Ionicons name="chatbubbles" size={18} color={theme.colors.primary} />
          </Surface>
          <View>
            <Text variant="titleMedium" style={styles.headerTitle}>
              ChatBot de Aprendizagem
            </Text>
            <Text variant="labelSmall" style={styles.headerSubtitle}>
              Aprenda interativamente
            </Text>
          </View>
        </View>
      </Surface>

      {/* ─── Messages ─── */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <Surface
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "user"
                ? [styles.userBubble, { backgroundColor: theme.colors.primaryContainer }]
                : [styles.botBubble, { backgroundColor: theme.colors.surfaceVariant }],
            ]}
            elevation={message.sender === "user" ? 1 : 0}
          >
            {message.sender === "bot" && (
              <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primary + "18" }]}>
                <Ionicons name="sparkles" size={12} color={theme.colors.primary} />
              </View>
            )}
            <Text
              variant="bodyMedium"
              style={{
                color:
                  message.sender === "user"
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurfaceVariant,
                flex: 1,
              }}
            >
              {message.text}
            </Text>
          </Surface>
        ))}
      </ScrollView>

      {/* ─── Input ─── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputArea}
      >
        <Surface style={styles.inputRow} elevation={2}>
          <TextInput
            mode="flat"
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ roundness: 24 }}
          />
          <IconButton
            icon="send"
            mode="contained"
            iconColor="#fff"
            containerColor={theme.colors.primary}
            size={22}
            onPress={handleSend}
            style={styles.sendBtn}
          />
        </Surface>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* ─── Header ─── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    marginRight: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 1,
  },

  /* ─── Messages ─── */
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "82%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },
  botBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  /* ─── Input area ─── */
  inputArea: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    paddingLeft: 8,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
  },
  sendBtn: {
    borderRadius: 22,
  },
});
