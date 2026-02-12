import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '@/src/services/userService';

export default function LoginScreen() {
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [secureEntry, setSecureEntry] = useState(true);

  const storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('BearerToken', token);
      console.log('Token armazenado com sucesso');
    } catch (error) {
      console.error('Erro ao armazenar o token:', error);
    }
  };

  const login = async function () {
    if (!telefone || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }
    setLoading(true);
    try {
      // 1. Verificar credenciais no Supabase
      const usuario = await loginUsuario(telefone, password);

      // 2. Guardar dados do utilizador localmente
      await AsyncStorage.setItem('userId', usuario.id || '');
      await AsyncStorage.setItem('userName', usuario.nome);
      await AsyncStorage.setItem('numberUser', usuario.telefone);

      // 3. Tentar também autenticar na API externa (para obter token)
      try {
        const response = await fetch("https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/login", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefone, password })
        });
        const result = await response.json();
        if (response.ok && result.token) {
          await storeToken(result.token);
        }
      } catch {
        // API externa indisponível — continuar com Supabase
        console.warn('API externa indisponível, login via Supabase.');
      }

      Alert.alert('Sucesso', `Bem-vindo(a), ${usuario.nome}! Vai receber o OTP no seu dispositivo.`);
      router.push({ pathname: '/Otp' });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível iniciar sessão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top section with brand background */}
      <View style={styles.topSection}>
        <ImageBackground
          source={require('@/assets/images/background-image1.png')}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <View style={styles.brandContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#fff" />
            <Text style={styles.brandTitle}>Nova Angola</Text>
            <Text style={styles.brandSubtitle}>Plataforma GovTech</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom section with login form */}
      <KeyboardAvoidingView
        style={styles.bottomSection}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            <Text style={styles.title}>Acessar a minha conta</Text>
            <Text style={styles.description}>
              Entre com as suas credenciais para continuar a transformar a sua comunidade.
            </Text>

            {/* Phone / NIF input */}
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons name="person-outline" size={18} color="#1B98F5" />
              </View>
              <TextInput
                placeholder="Número de Telefone/NIF"
                placeholderTextColor="#8BA3C7"
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#1B98F5" />
              </View>
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#8BA3C7"
                secureTextEntry={secureEntry}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)} style={styles.eyeButton}>
                <Ionicons name={secureEntry ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8BA3C7" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.replace({ pathname: '/registo' })} style={styles.forgotRow}>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={login}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.loginText}>Entrar</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Signup link */}
            <TouchableOpacity onPress={() => router.push({ pathname: '/registo' })} style={styles.signupRow}>
              <Text style={styles.signupText}>
                Não tenho uma conta?{' '}
                <Text style={styles.signupLink}>Criar conta</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },

  /* ───── Top brand section ───── */
  topSection: {
    flex: 0.4,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 61, 98, 0.75)',
  },
  brandContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  brandTitle: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#E3F5FF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },

  /* ───── Bottom form section ───── */
  bottomSection: {
    flex: 0.6,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: -10,
    shadowColor: '#0A3D62',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3D62',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#3F536C',
    marginBottom: 24,
    lineHeight: 19,
  },

  /* ───── Inputs ───── */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F6FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E3F5FF',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0A3D62',
  },
  eyeButton: {
    padding: 6,
  },

  /* ───── Forgot password ───── */
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 22,
  },
  forgotPassword: {
    marginRight: 75,
    color: '#1B98F5',
    fontSize: 13,
    fontWeight: '600',
  },

  /* ───── Login button ───── */
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#0A3D62',
    borderRadius: 30,
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A3D62',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  /* ───── Sign up ───── */
  signupRow: {
    marginTop: 22,
    alignItems: 'center',
  },
  signupText: {
    color: '#3F536C',
    fontSize: 14,
  },
  signupLink: {
    color: '#1B98F5',
    fontWeight: 'bold',
  },
});