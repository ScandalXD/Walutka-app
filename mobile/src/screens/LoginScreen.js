import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
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

      <Button title="Zaloguj" onPress={handleLogin} />
      <View style={{ height: 12 }} />
      <Button
        title="Nie masz konta? Zarejestruj się"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}
