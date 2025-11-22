import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';

export default function WalletTopUpScreen() {
  const [amount, setAmount] = useState('');

  const handleTopUp = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      return Alert.alert('Błąd', 'Podaj poprawną kwotę w PLN');
    }

    try {
      await api.post('/wallet/topup', { amount: value });
      Alert.alert('OK', 'Konto zostało zasilone');
      setAmount('');
    } catch (err) {
      console.log('ERR TOPUP:', err?.response?.data || err.message);
      Alert.alert('Błąd', 'Nie udało się zasilić konta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zasilenie konta (PLN)</Text>

      <Text style={styles.label}>Kwota w PLN</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="np. 1000"
      />

      <Button title="Zasil konto" onPress={handleTopUp} />
    </View>
  );
}
