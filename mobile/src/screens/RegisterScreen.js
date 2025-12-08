import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import AppButton from '../components/AppButton';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !email.includes('@')) {
      return Alert.alert('Błąd', 'Podaj poprawny adres email');
    }
    if (!password || password.length < 4) {
      return Alert.alert('Błąd', 'Hasło musi mieć min. 4 znaki');
    }

    try {
      await api.post('/auth/register', { email, password });
      Alert.alert('OK', 'Konto utworzone, możesz się zalogować');
      navigation.navigate('Login');
    } catch (err) {
      console.log('ERR REGISTER:', err?.response?.data || err.message);
      Alert.alert('Błąd', 'Nie udało się zarejestrować (sprawdź email)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.authCard}>
        <Text style={styles.title}>Rejestracja</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="podaj email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Hasło</Text>
        <TextInput
          style={styles.input}
          placeholder="podaj hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton title="Utwórz konto" onPress={handleRegister} />

        <AppButton
          title="Masz już konto? Zaloguj się"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}
