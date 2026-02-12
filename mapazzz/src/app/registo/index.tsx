import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { cadastrarUsuario } from '@/src/services/userService';
import { validarNIF, validarTelefone, nomeCorrespondeAoNIF } from '@/src/services/angolaApi';

type ValidationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntry1, setSecureEntry1] = useState(true);

  // Validation states
  const [nifStatus, setNifStatus] = useState<ValidationStatus>('idle');
  const [nifMessage, setNifMessage] = useState('');
  const [nifNome, setNifNome] = useState('');  // nome retornado pela API do NIF
  const [phoneStatus, setPhoneStatus] = useState<ValidationStatus>('idle');
  const [phoneMessage, setPhoneMessage] = useState('');

  // Debounce timer refs
  const nifTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── NIF validation with debounce ──
  const handleNifChange = useCallback((value: string) => {
    setEmail(value);
    setNifStatus('idle');
    setNifMessage('');
    setNifNome('');

    if (nifTimerRef.current) clearTimeout(nifTimerRef.current);

    // NIF angolano tem tipicamente 14 caracteres (ex: 006151112LA041)
    if (value.length >= 10) {
      setNifStatus('loading');
      nifTimerRef.current = setTimeout(async () => {
        const result = await validarNIF(value);
        setNifStatus(result.success ? 'valid' : 'invalid');
        setNifMessage(result.message);
        if (result.success && result.nome) {
          setNifNome(result.nome);
        }
      }, 800);
    }
  }, []);

  // ── Phone validation with debounce ──
  const handlePhoneChange = useCallback((value: string) => {
    setTelefone(value);
    setPhoneStatus('idle');
    setPhoneMessage('');

    if (phoneTimerRef.current) clearTimeout(phoneTimerRef.current);

    // Telefone angolano: 9 dígitos sem prefixo ou 12+ com prefixo
    if (value.length >= 9) {
      setPhoneStatus('loading');
      phoneTimerRef.current = setTimeout(async () => {
        const result = await validarTelefone(value);
        setPhoneStatus(result.success ? 'valid' : 'invalid');
        setPhoneMessage(result.message);
      }, 800);
    }
  }, []);

  // ── Status icon helper ──
  const renderStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case 'loading':
        return <ActivityIndicator size="small" color="#1B98F5" style={{ marginLeft: 6 }} />;
      case 'valid':
        return <Ionicons name="checkmark-circle" size={20} color="#16A085" style={{ marginLeft: 6 }} />;
      case 'invalid':
        return <Ionicons name="close-circle" size={20} color="#FF6B3C" style={{ marginLeft: 6 }} />;
      default:
        return null;
    }
  };

  const cadastro = async () => {
    // Validações básicas
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

    // Validar NIF antes de submeter (se ainda não foi validado)
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
        // Verificar se o nome digitado corresponde ao nome do NIF
        if (!nomeCorrespondeAoNIF(nome, nifResult.nome)) {
          Alert.alert(
            'Nome não corresponde',
            `O nome digitado não corresponde ao NIF.\n\nNome no NIF: ${nifResult.nome}`,
          );
          return;
        }
      }
    } else if (nifNome) {
      // NIF já foi validado, mas verifica se o nome ainda corresponde
      if (!nomeCorrespondeAoNIF(nome, nifNome)) {
        Alert.alert(
          'Nome não corresponde',
          `O nome digitado não corresponde ao NIF.\n\nNome no NIF: ${nifNome}`,
        );
        return;
      }
    }

    // Validar telefone antes de submeter (se ainda não foi validado)
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
      // Registar no Supabase
      await cadastrarUsuario({ nome, email, telefone, password });

      // Também registar na API externa (mantém a lógica existente)
      try {
        await fetch('https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/cadastro', {
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
      {/* Top section with brand background */}
      <View style={styles.topSection}>
        <ImageBackground
          source={require('@/assets/images/background-image1.png')}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <View style={styles.brandContainer}>
            <Ionicons name="person-add" size={44} color="#fff" />
            <Text style={styles.brandTitle}>Criar Conta</Text>
            <Text style={styles.brandSubtitle}>Nova Angola</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom section with form */}
      <KeyboardAvoidingView
        style={styles.bottomSection}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            {/* Back button */}
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={20} color="#0A3D62" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Registo de Utilizador</Text>
            <Text style={styles.description}>
              Preencha os seus dados para fazer parte da comunidade Nova Angola.
            </Text>

            {/* Nome */}
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons name="person-outline" size={18} color="#1B98F5" />
              </View>
              <TextInput
                placeholder="Primeiro e Último Nome"
                placeholderTextColor="#8BA3C7"
                style={styles.input}
                value={nome}
                onChangeText={setNome}
              />
            </View>

            {/* NIF — com validação em tempo real */}
            <View style={[
              styles.inputContainer,
              nifStatus === 'valid' && styles.inputValid,
              nifStatus === 'invalid' && styles.inputInvalid,
            ]}>
              <View style={styles.iconWrapper}>
                <Ionicons name="card-outline" size={18} color="#1B98F5" />
              </View>
              <TextInput
                placeholder="NIF (ex: 006151112LA041)"
                placeholderTextColor="#8BA3C7"
                style={styles.input}
                value={email}
                onChangeText={handleNifChange}
                autoCapitalize="characters"
              />
              {renderStatusIcon(nifStatus)}
            </View>
            {nifMessage ? (
              <Text style={[styles.validationMsg, nifStatus === 'valid' ? styles.validMsg : styles.invalidMsg]}>
                {nifMessage}
              </Text>
            ) : null}

            {/* Telefone — com validação em tempo real */}
            <View style={[
              styles.inputContainer,
              phoneStatus === 'valid' && styles.inputValid,
              phoneStatus === 'invalid' && styles.inputInvalid,
            ]}>
              <View style={styles.iconWrapper}>
                <Ionicons name="call-outline" size={18} color="#1B98F5" />
              </View>
              <TextInput
                placeholder="Telefone (ex: 923445618)"
                placeholderTextColor="#8BA3C7"
                style={styles.input}
                value={telefone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
              />
              {renderStatusIcon(phoneStatus)}
            </View>
            {phoneMessage ? (
              <Text style={[styles.validationMsg, phoneStatus === 'valid' ? styles.validMsg : styles.invalidMsg]}>
                {phoneMessage}
              </Text>
            ) : null}

            {/* Senha */}
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

            {/* Confirmar Senha */}
            <View style={[
              styles.inputContainer,
              password1.length > 0 && password1 === password && styles.inputValid,
              password1.length > 0 && password1 !== password && styles.inputInvalid,
            ]}>
              <View style={styles.iconWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#1B98F5" />
              </View>
              <TextInput
                placeholder="Confirmar Senha"
                placeholderTextColor="#8BA3C7"
                secureTextEntry={secureEntry1}
                style={styles.input}
                value={password1}
                onChangeText={setPassword1}
              />
              <TouchableOpacity onPress={() => setSecureEntry1(!secureEntry1)} style={styles.eyeButton}>
                <Ionicons name={secureEntry1 ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8BA3C7" />
              </TouchableOpacity>
              {password1.length > 0 && (
                password1 === password
                  ? <Ionicons name="checkmark-circle" size={20} color="#16A085" style={{ marginLeft: 2 }} />
                  : <Ionicons name="close-circle" size={20} color="#FF6B3C" style={{ marginLeft: 2 }} />
              )}
            </View>
            {password1.length > 0 && password1 !== password ? (
              <Text style={[styles.validationMsg, styles.invalidMsg]}>As senhas não coincidem.</Text>
            ) : null}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={cadastro}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.registerText}>Registrar</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Login link */}
            <TouchableOpacity onPress={() => router.push('/Login')} style={styles.loginRow}>
              <Text style={styles.loginLinkText}>
                Já tenho uma conta?{' '}
                <Text style={styles.loginLink}>Entrar</Text>
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
    flex: 0.28,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#E3F5FF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },

  /* ───── Bottom form section ───── */
  bottomSection: {
    flex: 0.72,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: -28,
    shadowColor: '#0A3D62',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  /* ───── Back button ───── */
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    color: '#0A3D62',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },

  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#0A3D62',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#3F536C',
    marginBottom: 22,
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3F5FF',
  },
  inputValid: {
    borderColor: '#16A085',
    borderWidth: 1.5,
  },
  inputInvalid: {
    borderColor: '#FF6B3C',
    borderWidth: 1.5,
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

  /* ───── Validation messages ───── */
  validationMsg: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 54,
  },
  validMsg: {
    color: '#16A085',
  },
  invalidMsg: {
    color: '#FF6B3C',
  },

  /* ───── Register button ───── */
  registerButton: {
    flexDirection: 'row',
    backgroundColor: '#0A3D62',
    borderRadius: 30,
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#0A3D62',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  /* ───── Login link ───── */
  loginRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#3F536C',
    fontSize: 14,
  },
  loginLink: {
    color: '#1B98F5',
    fontWeight: 'bold',
  },
});