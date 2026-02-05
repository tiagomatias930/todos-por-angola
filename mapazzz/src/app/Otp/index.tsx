import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from '../../components/ImageViewer';

const PlaceholderImage = require('@/assets/images/emoji1.png');

export default function VerificationScreen() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputs = useRef<(TextInput | null)[]>([]);

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

    // Se o OTP estiver completo, verificar
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
      router.replace("/login");
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.bottomHalf} />

      <View style={styles.otpContainer}>
        <Text style={styles.title}>Código de verificação</Text>

        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Text style={styles.infoText}>
          Nós enviamos o seu OTP para o seu número. Teste: {generatedOtp}
        </Text>
        <Text style={styles.resendText}>
          Não recebeu o código?{' '}
          <Text
            style={[styles.resendLink, loading && styles.disabledLink]}
            onPress={!loading ? handleSendOtp : undefined}
          >
            Reenviar OTP.
          </Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleChange('', 3)}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>

        {generatedOtp && (
          <Text style={styles.debugText}>OTP Gerado: {generatedOtp}</Text>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
  },
  errorText:
  {
    color: 'red',
    fontStyle: 'italic',

  },
  topHalf: {
    flex: 1,
    backgroundColor: '#238b45',
    width: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '50%',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    height: '50%',
  },
  otpContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#238b45',
    marginBottom: 15,
  },
  otpInputContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    marginBottom: 15,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#238b45',
    borderRadius: 10,
    textAlign: 'center' as const,
    fontSize: 18,
    marginHorizontal: 5,
    color: '#000',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  resendText: {
    fontSize: 12,
    color: '#666',
  },
  resendLink: {
    color: 'blue',
    fontWeight: '500' as const,
  },
  disabledLink: {
    color: '#999',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#238b45',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#238b45',
    marginTop: 10,
  },
});