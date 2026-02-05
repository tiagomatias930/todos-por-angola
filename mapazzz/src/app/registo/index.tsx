import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [telefone, setTelefone] = useState("");
const [password, setPassword] = useState("");

const cadastro = async function () {
  try
  {
    const result = await fetch("https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/cadastro", {
      method:"POST",
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({nome, email, telefone, password})
    });
  
    const consulta = await result.json();
    if(!result.ok)
        Alert.alert("Mensagem", "Erro no Cadastro");
    else
    {
      Alert.alert("Mensagem", "Sucesso");
    }
  }
  catch(error)
  {
    Alert.alert("Error", error.message);
  }
  
}

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <ImageBackground
          source={require('@/assets/images/background-image1.png')}
          style={styles.imageBackground}
        />
      </View>

      <View style={styles.bottomHalf}>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          <Text style={styles.title}>Registar conta</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" style={styles.icon} />
            <TextInput placeholder="nome" style={styles.input} value={nome} onChangeText={setNome} />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" style={styles.icon} />
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" style={styles.icon} />
            <TextInput placeholder="Telefone" style={styles.input} value={telefone} onChangeText={setTelefone}/>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#666" style={styles.icon} />
            <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={password} onChangeText={setPassword}/>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={cadastro}>
            <Text style={styles.registerText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topHalf: {
    flex: 0.3,
    backgroundColor: '#238b45',
    position: 'relative',
  },

  bottomHalf: {
    flex: 0.7,
    backgroundColor: '#fff',
  },

  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },

  contentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 50,
  },
  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 0,
  },

  backText: {
    color: '#238b45',
    marginLeft: 5,
  },
  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#238b45',
    marginBottom: 20,
  },

  inputContainer: {
    opacity: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '100%',
    height: 42,
    marginBottom: 19,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: '100%',
  },

  registerButton: {
    backgroundColor: '#238b45',
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  
  registerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});