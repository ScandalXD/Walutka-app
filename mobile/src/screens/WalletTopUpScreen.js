import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import * as WebBrowser from 'expo-web-browser';

export default function WalletTopUpScreen() {
  const [amount, setAmount] = useState('');
  
  const handleTopUpPayU = async () => {
  const value = parseFloat(amount);
  if (!value || value <= 0) {
    return Alert.alert('Błąd', 'Podaj poprawną kwotę w PLN');
  }

  try {
    const res = await api.post('/payments/payu/create', { amount: value });
    const redirectUri = res.data.redirectUri;

    if (!redirectUri) {
      return Alert.alert('Błąd', 'Brak adresu płatności PayU');
    }

    await WebBrowser.openBrowserAsync(redirectUri);
    await api.post('/wallet/topup', { amount: value });

    Alert.alert(
      'OK',
      'Konto zostało zasilone po płatności PayU (sandbox – wirtualne środki)'
    );
    setAmount('');
  } catch (err) {
    console.log('ERR PAYU:', err?.response?.data || err.message);
    Alert.alert(
      'Błąd',
      err?.response?.data?.message ||
        'Nie udało się utworzyć płatności PayU (sandbox)'
    );
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
        placeholder="np. 100"
      />
      <Button title="Doładuj przez PayU" onPress={handleTopUpPayU} />
    </View>
  );
}
