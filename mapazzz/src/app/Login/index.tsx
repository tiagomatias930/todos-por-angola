import React, {useState, useEffect}from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('BearerToken', token);
      console.log('Token armazenado com sucesso');
    } catch (error) {
      console.error('Erro ao armazenar o token:', error);
    }
  };
  
  const login = async function () {
    setLoading(true);
    setError(null);
    try
    {
      const response = await fetch("https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/login", {
        method:"POST",
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({telefone, password})
      });

      const result = await response.json();
      if(!response.ok)
          Alert.alert("Error", "Erro ao tentar logar");
      else
      {
        storeToken(result.token);
        Alert.alert('Sucesso', "Login realizado com sucesso! vai receber o OTP no seu dispositivo");
        router.push("/Otp");
      }
      // if(!response.ok)
      //   throw new Error("Falha ao conectar com a api");
      // const result = await response.json();
      // setData(result);
    }catch(error:any)
    {
      Alert.alert(error.message);
    }
    finally
    {
      setLoading(false);
    }
  };

  // useEffect(function(){
  //   fetchdata();
  // }, []);
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
          <Text style={styles.title}>Entrar na minha conta</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" style={styles.icon} />
            <TextInput placeholder="Email ou número de telefone" style={styles.input} value={telefone} onChangeText={setTelefone}/>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#666" style={styles.icon} />
            <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={password} onChangeText={setPassword}/>
          </View>

          <TouchableOpacity onPress={() => router.replace('/recuperar')}>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={login}>
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/registo")}>
            <Text style={styles.signupText}>
              Não tenho uma conta? <Text style={styles.signupLink}>Criar conta</Text>
            </Text>
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
        flex: 0.5,
        backgroundColor: '#238b45',
        position: 'relative',
    },

    bottomHalf: {
        flex: 0.5, 
        backgroundColor: '#fff',
    },

    imageBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },

    contentContainer: {
        paddingHorizontal: 35,
        alignItems: 'center',
        marginTop: 50,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#238b45',
        marginBottom: 25,
        marginTop: 5,
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
    marginBottom: 20,
},

icon: {
    marginRight: 10,
},

input: {
    flex: 1,
    height: '100%',
},

forgotPassword: {
    alignSelf: 'flex-end',
    color: '#56c1c8',
    marginBottom: 20,
},

loginButton: {
    backgroundColor: '#238b45',
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
},

loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},

signupText: {
    marginTop: 20,
    color: '#666',
},
signupLink: {
    color: '#239b25',
    fontWeight: 'bold',
},
});