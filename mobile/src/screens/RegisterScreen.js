import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
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

      <Button title="Utwórz konto" onPress={handleRegister} />
    </View>
  );
}
