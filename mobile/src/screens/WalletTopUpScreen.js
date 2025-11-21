import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';

export default function WalletTopUpScreen() {
  const [amount, setAmount] = useState('');

  const handleTopUp = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      return Alert.alert('Błąd', 'Podaj poprawną kwotę');
    }
    try {
      await api.post('/wallet/topup', { amount: value });
      Alert.alert('OK', 'Konto zostało zasilone');
      setAmount('');
    } catch (err) {
      Alert.alert('Błąd', 'Nie udało się zasilić konta');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>
        Zasilenie konta (PLN)
      </Text>
      <TextInput
        placeholder="Kwota w PLN"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title="Zasil konto" onPress={handleTopUp} />
    </View>
  );
}
