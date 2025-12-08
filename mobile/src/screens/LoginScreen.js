import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import AppButton from '../components/AppButton';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !email.includes('@')) {
      return Alert.alert('Błąd', 'Podaj poprawny adres email');
    }
    if (!password || password.length < 4) {
      return Alert.alert('Błąd', 'Hasło musi mieć min. 4 znaki');
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.token);
    } catch (err) {
      console.log('ERR LOGIN:', err?.response?.data || err.message);
      Alert.alert('Błąd', 'Nie udało się zalogować');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.authCard}>
        <Text style={styles.title}>Logowanie</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="podaj email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Hasło</Text>
        <TextInput
          placeholder="podaj hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <AppButton title="Zaloguj" onPress={handleLogin} />

        <AppButton
          title="Nie masz konta? Zarejestruj się"
          variant="secondary"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
}
