import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerificationScreen() {
  const theme = useTheme();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputs = useRef<(RNTextInput | null)[]>([]);

  useEffect(() => {
    const getPhoneNumber = async () => {
      try {
        const number = await AsyncStorage.getItem('numberUser');
        if (number) setPhoneNumber(number);
      } catch (e) {
        console.error('Erro ao recuperar número:', e);
      }
    };
    const generateOtp = () => {
      const otpGenerated = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otpGenerated);
      console.log('OTP Gerado:', otpGenerated);
    };
    getPhoneNumber();
    generateOtp();
  }, []);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
    if (newOtp.every((digit) => digit !== '')) {
      const enteredOtp = newOtp.join('');
      if (enteredOtp !== generatedOtp) {
        setErrorMessage('OTP inválido');
      } else {
        setErrorMessage('');
        Alert.alert('Sucesso', 'OTP verificado com sucesso!');
        router.push('/Mapa');
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 9) {
      Alert.alert('Erro', 'Número inválido ou não encontrado.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      router.replace('/Login');
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* ─── Top decorative section ─── */}
      <View style={[styles.topDecoration, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.topContent}>
          <Surface style={styles.otpIconSurface} elevation={0}>
            <Ionicons name="keypad" size={32} color={theme.colors.primary} />
          </Surface>
          <Text variant="headlineSmall" style={styles.topTitle}>
            Verificação
          </Text>
          <Text variant="bodySmall" style={styles.topSubtitle}>
            Introduza o código enviado
          </Text>
        </View>
      </View>

      {/* ─── OTP Card ─── */}
      <Surface style={styles.otpCard} elevation={3}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
          Código de verificação
        </Text>
        <Text variant="bodySmall" style={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Introduza o código de 4 dígitos
        </Text>

        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <RNTextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                styles.otpInput,
                {
                  borderColor: digit
                    ? errorMessage
                      ? theme.colors.error
                      : theme.colors.primary
                    : theme.colors.outlineVariant,
                  backgroundColor: digit
                    ? theme.colors.primaryContainer + '40'
                    : theme.colors.surfaceVariant + '60',
                },
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {errorMessage ? (
          <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
            {errorMessage}
          </Text>
        ) : null}

        <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
          Nós enviamos o seu OTP para o seu número.
        </Text>

        <Text variant="bodySmall" style={[styles.resendText, { color: theme.colors.onSurfaceVariant }]}>
          Não recebeu o código?{' '}
          <Text
            style={[styles.resendLink, { color: theme.colors.primary }]}
            onPress={!loading ? handleSendOtp : undefined}
          >
            Reenviar OTP
          </Text>
        </Text>

        <Button
          mode="contained"
          icon="arrow-right"
          onPress={() => handleChange('', 3)}
          style={styles.verifyButton}
          contentStyle={styles.verifyButtonContent}
          labelStyle={styles.verifyButtonLabel}
          buttonColor={theme.colors.primary}
        >
          Verificar
        </Button>

        {generatedOtp ? (
          <Surface style={[styles.debugChip, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
            <Ionicons name="bug" size={14} color={theme.colors.onSecondaryContainer} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 6 }}>
              OTP Teste: {generatedOtp}
            </Text>
          </Surface>
        ) : null}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  /* ─── Top decoration ─── */
  topDecoration: {
    width: '100%',
    height: '40%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContent: {
    alignItems: 'center',
  },
  otpIconSurface: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  topTitle: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  topSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  /* ─── OTP Card ─── */
  otpCard: {
    width: '88%',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginTop: -48,
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    marginBottom: 24,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  errorText: {
    marginBottom: 12,
    fontWeight: '500',
  },
  infoText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  resendText: {
    marginBottom: 24,
  },
  resendLink: {
    fontWeight: '700',
  },
  verifyButton: {
    width: '100%',
    borderRadius: 100,
  },
  verifyButtonContent: {
    height: 48,
    flexDirection: 'row-reverse',
  },
  verifyButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  debugChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
});