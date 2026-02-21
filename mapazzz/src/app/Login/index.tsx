import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '@/src/services/userService';
import { ENV } from '@/src/config/env';

export default function LoginScreen() {
  const theme = useTheme();
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [secureEntry, setSecureEntry] = useState(true);

  const storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('BearerToken', token);
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
      const usuario = await loginUsuario(telefone, password);
      await AsyncStorage.setItem('userId', usuario.id || '');
      await AsyncStorage.setItem('userName', usuario.nome);
      await AsyncStorage.setItem('numberUser', usuario.telefone);

      try {
        const response = await fetch(
          `${ENV.API_BASE_URL}/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefone, password }),
          }
        );
        const result = await response.json();
        if (response.ok && result.token) {
          await storeToken(result.token);
        }
      } catch {
        console.warn('API externa indisponível, login via Supabase.');
      }

      Alert.alert(
        'Sucesso',
        `Bem-vindo(a), ${usuario.nome}! Vai receber o OTP no seu dispositivo.`
      );
      router.push({ pathname: '/Otp' });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível iniciar sessão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ─── Top Brand Section ─── */}
      <View style={styles.topSection}>
        <ImageBackground
          source={require('@/assets/images/background-image1.png')}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <View style={styles.brandContainer}>
            <Surface
              style={[styles.brandIconSurface, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
              elevation={0}
            >
              <Ionicons name="shield-checkmark" size={40} color="#fff" />
            </Surface>
            <Text variant="headlineMedium" style={styles.brandTitle}>
              Nova Angola
            </Text>
            <Text variant="labelMedium" style={styles.brandSubtitle}>
              Plataforma GovTech
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* ─── Bottom Form Section ─── */}
      <KeyboardAvoidingView
        style={styles.bottomSection}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.formCard} elevation={2}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
              Acessar a minha conta
            </Text>
            <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              Entre com as suas credenciais para continuar a transformar a sua comunidade.
            </Text>

            {/* Phone Input */}
            <TextInput
              label="Número de Telefone / NIF"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              mode="outlined"
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              theme={{
                roundness: 14,
                colors: { primary: theme.colors.primary },
              }}
            />

            {/* Password Input */}
            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureEntry}
              mode="outlined"
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setSecureEntry(!secureEntry)}
                />
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
              theme={{
                roundness: 14,
                colors: { primary: theme.colors.primary },
              }}
            />

            {/* Forgot password */}
            <Button
              mode="text"
              compact
              onPress={() => router.replace({ pathname: '/registo' })}
              labelStyle={styles.forgotLabel}
              style={styles.forgotButton}
            >
              Esqueci minha senha
            </Button>

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={login}
              disabled={loading}
              loading={loading}
              icon={loading ? undefined : 'login'}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
              buttonColor={theme.colors.primary}
            >
              {loading ? 'A entrar...' : 'Entrar'}
            </Button>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.outlineVariant }]} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginHorizontal: 12 }}>
                ou
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.outlineVariant }]} />
            </View>

            {/* Sign up link */}
            <Button
              mode="outlined"
              icon="account-plus"
              onPress={() => router.push({ pathname: '/registo' })}
              style={styles.signupButton}
              contentStyle={styles.signupButtonContent}
              labelStyle={[styles.signupButtonLabel, { color: theme.colors.primary }]}
              theme={{ roundness: 100 }}
            >
              Criar conta
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFE',
  },

  /* ─── Top brand section ─── */
  topSection: {
    flex: 0.38,
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
    backgroundColor: 'rgba(21, 101, 192, 0.82)',
  },
  brandContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  brandIconSurface: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  /* ─── Bottom form section ─── */
  bottomSection: {
    flex: 0.62,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  formCard: {
    borderRadius: 28,
    padding: 24,
    marginTop: -24,
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    marginBottom: 24,
    lineHeight: 21,
  },
  input: {
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  inputOutline: {
    borderRadius: 14,
  },

  /* ─── Forgot password ─── */
  forgotButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotLabel: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* ─── Login button ─── */
  loginButton: {
    borderRadius: 100,
  },
  loginButtonContent: {
    height: 52,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* ─── Divider ─── */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },

  /* ─── Signup button ─── */
  signupButton: {
    borderRadius: 100,
  },
  signupButtonContent: {
    height: 48,
  },
  signupButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});