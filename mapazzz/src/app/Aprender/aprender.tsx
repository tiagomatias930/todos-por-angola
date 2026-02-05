import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Define interface para a estrutura das mensagens
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function TelaAprender() {
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

  // Função para voltar à página anterior
  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>ChatBot de Aprendizagem</Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(message => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble, 
              message.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem..."
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#4a86e8",
    paddingTop: 40, // Para dar espaço para a status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#e1f5fe',
    alignSelf: 'flex-end',
    marginLeft: '20%',
  },
  botBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#4a86e8',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
