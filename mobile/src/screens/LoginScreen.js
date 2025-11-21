import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.token);
    } catch (err) {
      console.log(err?.response?.data);
      Alert.alert('Błąd', 'Nie udało się zalogować');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Logowanie</Text>
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
      <Button title="Zaloguj" onPress={handleLogin} />
      <View style={{ height: 8 }} />
      <Button
        title="Nie masz konta? Zarejestruj się"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}
