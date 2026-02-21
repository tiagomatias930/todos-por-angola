import React, { useState, useCallback } from 'react';
import { ENV } from '@/src/config/env';
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
  useTheme,
  ActivityIndicator,
  HelperText,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { cadastrarUsuario } from '@/src/services/userService';
import { validarNIF, validarTelefone, nomeCorrespondeAoNIF } from '@/src/services/angolaApi';

type ValidationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

export default function RegisterScreen() {
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntry1, setSecureEntry1] = useState(true);

  const [nifStatus, setNifStatus] = useState<ValidationStatus>('idle');
  const [nifMessage, setNifMessage] = useState('');
  const [nifNome, setNifNome] = useState('');
  const [phoneStatus, setPhoneStatus] = useState<ValidationStatus>('idle');
  const [phoneMessage, setPhoneMessage] = useState('');

  const nifTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNifChange = useCallback((value: string) => {
    setEmail(value);
    setNifStatus('idle');
    setNifMessage('');
    setNifNome('');
    if (nifTimerRef.current) clearTimeout(nifTimerRef.current);
    if (value.length >= 10) {
      setNifStatus('loading');
      nifTimerRef.current = setTimeout(async () => {
        const result = await validarNIF(value);
        setNifStatus(result.success ? 'valid' : 'invalid');
        setNifMessage(result.message);
        if (result.success && result.nome) setNifNome(result.nome);
      }, 800);
    }
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setTelefone(value);
    setPhoneStatus('idle');
    setPhoneMessage('');
    if (phoneTimerRef.current) clearTimeout(phoneTimerRef.current);
    if (value.length >= 9) {
      setPhoneStatus('loading');
      phoneTimerRef.current = setTimeout(async () => {
        const result = await validarTelefone(value);
        setPhoneStatus(result.success ? 'valid' : 'invalid');
        setPhoneMessage(result.message);
      }, 800);
    }
  }, []);

  const getOutlineColor = (status: ValidationStatus) => {
    if (status === 'valid') return theme.colors.secondary;
    if (status === 'invalid') return theme.colors.error;
    return undefined;
  };

  const getStatusIcon = (status: ValidationStatus) => {
    if (status === 'loading') return 'loading';
    if (status === 'valid') return 'check-circle';
    if (status === 'invalid') return 'close-circle';
    return undefined;
  };

  const cadastro = async () => {
    if (!nome || !email || !telefone || !password || !password1) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }
    if (password !== password1) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (nifStatus !== 'valid') {
      setNifStatus('loading');
      const nifResult = await validarNIF(email);
      setNifStatus(nifResult.success ? 'valid' : 'invalid');
      setNifMessage(nifResult.message);
      if (!nifResult.success) {
        Alert.alert('NIF Inválido', nifResult.message);
        return;
      }
      if (nifResult.nome) {
        setNifNome(nifResult.nome);
        if (!nomeCorrespondeAoNIF(nome, nifResult.nome)) {
          Alert.alert('Nome não corresponde', `O nome digitado não corresponde ao NIF.\n\nNome no NIF: ${nifResult.nome}`);
          return;
        }
      }
    } else if (nifNome) {
      if (!nomeCorrespondeAoNIF(nome, nifNome)) {
        Alert.alert('Nome não corresponde', `O nome digitado não corresponde ao NIF.\n\nNome no NIF: ${nifNome}`);
        return;
      }
    }

    if (phoneStatus !== 'valid') {
      setPhoneStatus('loading');
      const phoneResult = await validarTelefone(telefone);
      setPhoneStatus(phoneResult.success ? 'valid' : 'invalid');
      setPhoneMessage(phoneResult.message);
      if (!phoneResult.success) {
        Alert.alert('Telefone Inválido', phoneResult.message);
        return;
      }
    }

    setLoading(true);
    try {
      await cadastrarUsuario({ nome, email, telefone, password });
      try {
        await fetch(`${ENV.API_BASE_URL}/cadastro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, telefone, password }),
        });
      } catch {
        console.warn('API externa indisponível, mas Supabase registou com sucesso.');
      }
      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.', [
        { text: 'OK', onPress: () => router.replace('/Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar a conta.');
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
            <Surface style={styles.brandIconSurface} elevation={0}>
              <Ionicons name="person-add" size={36} color="#fff" />
            </Surface>
            <Text variant="headlineSmall" style={styles.brandTitle}>
              Criar Conta
            </Text>
            <Text variant="labelSmall" style={styles.brandSubtitle}>
              Nova Angola
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
            {/* Back button */}
            <IconButton
              icon="arrow-left"
              mode="contained-tonal"
              size={20}
              onPress={() => router.back()}
              style={styles.backButton}
            />

            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
              Registo de Utilizador
            </Text>
            <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              Preencha os seus dados para fazer parte da comunidade Nova Angola.
            </Text>

            {/* Nome */}
            <TextInput
              label="Primeiro e Último Nome"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              theme={{ roundness: 14 }}
            />

            {/* NIF */}
            <TextInput
              label="NIF (ex: 006151112LA041)"
              value={email}
              onChangeText={handleNifChange}
              autoCapitalize="characters"
              mode="outlined"
              left={<TextInput.Icon icon="card-account-details-outline" />}
              right={
                nifStatus === 'loading' ? (
                  <TextInput.Icon icon="loading" />
                ) : nifStatus === 'valid' ? (
                  <TextInput.Icon icon="check-circle" color={theme.colors.secondary} />
                ) : nifStatus === 'invalid' ? (
                  <TextInput.Icon icon="close-circle" color={theme.colors.error} />
                ) : undefined
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor={getOutlineColor(nifStatus)}
              activeOutlineColor={getOutlineColor(nifStatus) || theme.colors.primary}
              theme={{ roundness: 14 }}
            />
            {nifMessage ? (
              <HelperText
                type={nifStatus === 'valid' ? 'info' : 'error'}
                visible
                style={styles.helperText}
              >
                {nifMessage}
              </HelperText>
            ) : null}

            {/* Telefone */}
            <TextInput
              label="Telefone (ex: 923445618)"
              value={telefone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              mode="outlined"
              left={<TextInput.Icon icon="phone-outline" />}
              right={
                phoneStatus === 'loading' ? (
                  <TextInput.Icon icon="loading" />
                ) : phoneStatus === 'valid' ? (
                  <TextInput.Icon icon="check-circle" color={theme.colors.secondary} />
                ) : phoneStatus === 'invalid' ? (
                  <TextInput.Icon icon="close-circle" color={theme.colors.error} />
                ) : undefined
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor={getOutlineColor(phoneStatus)}
              activeOutlineColor={getOutlineColor(phoneStatus) || theme.colors.primary}
              theme={{ roundness: 14 }}
            />
            {phoneMessage ? (
              <HelperText
                type={phoneStatus === 'valid' ? 'info' : 'error'}
                visible
                style={styles.helperText}
              >
                {phoneMessage}
              </HelperText>
            ) : null}

            {/* Senha */}
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
              theme={{ roundness: 14 }}
            />

            {/* Confirmar Senha */}
            <TextInput
              label="Confirmar Senha"
              value={password1}
              onChangeText={setPassword1}
              secureTextEntry={secureEntry1}
              mode="outlined"
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={secureEntry1 ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setSecureEntry1(!secureEntry1)}
                />
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor={
                password1.length > 0
                  ? password1 === password
                    ? theme.colors.secondary
                    : theme.colors.error
                  : undefined
              }
              theme={{ roundness: 14 }}
            />
            {password1.length > 0 && password1 !== password && (
              <HelperText type="error" visible style={styles.helperText}>
                As senhas não coincidem.
              </HelperText>
            )}

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={cadastro}
              disabled={loading}
              loading={loading}
              icon={loading ? undefined : 'check-circle-outline'}
              style={styles.registerButton}
              contentStyle={styles.registerButtonContent}
              labelStyle={styles.registerButtonLabel}
              buttonColor={theme.colors.primary}
            >
              {loading ? 'A registar...' : 'Registrar'}
            </Button>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.outlineVariant }]} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginHorizontal: 12 }}>
                ou
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.outlineVariant }]} />
            </View>

            {/* Login link */}
            <Button
              mode="outlined"
              icon="login"
              onPress={() => router.push('/Login')}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={[styles.loginButtonLabel, { color: theme.colors.primary }]}
              theme={{ roundness: 100 }}
            >
              Já tenho conta — Entrar
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
    flex: 0.26,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  /* ─── Bottom form section ─── */
  bottomSection: {
    flex: 0.74,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  formCard: {
    borderRadius: 28,
    padding: 24,
    marginTop: -20,
  },

  /* ─── Back button ─── */
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  title: {
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    marginBottom: 20,
    lineHeight: 21,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  inputOutline: {
    borderRadius: 14,
  },
  helperText: {
    marginTop: -8,
    marginBottom: 4,
    paddingLeft: 8,
  },

  /* ─── Register button ─── */
  registerButton: {
    marginTop: 8,
    borderRadius: 100,
  },
  registerButtonContent: {
    height: 52,
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* ─── Divider ─── */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },

  /* ─── Login button ─── */
  loginButton: {
    borderRadius: 100,
  },
  loginButtonContent: {
    height: 48,
  },
  loginButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});