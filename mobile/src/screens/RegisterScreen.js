import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
  try {
    await api.post('/auth/register', { email, password });
    Alert.alert('OK', 'Konto utworzone, możesz się zalogować');
    navigation.navigate('Login');
  } catch (err) {
    console.log('ERR REGISTER:', err.message);
    console.log('RESP:', err?.response?.data);
    Alert.alert(
      'Błąd',
      err?.response?.data?.message || 'Nie udało się zarejestrować'
    );
  }
};

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Rejestracja</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title="Utwórz konto" onPress={handleRegister} />
    </View>
  );
}
