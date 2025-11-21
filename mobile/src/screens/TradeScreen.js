import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import api from '../api/apiClient';

export default function TradeScreen() {
  const [mode, setMode] = useState('BUY'); // BUY / SELL
  const [currency, setCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      return Alert.alert('Błąd', 'Podaj poprawną kwotę');
    }

    try {
      if (mode === 'BUY') {
        // kupujemy walutę za PLN
        const res = await api.post('/transactions/buy', {
          currencyTo: currency.toUpperCase(),
          amountPln: value,
        });
        Alert.alert(
          'Sukces',
          `Kupiono ${res.data.amountForeign.toFixed(2)} ${currency.toUpperCase()} po kursie ${res.data.rate}`
        );
      } else {
        // sprzedajemy walutę obcą za PLN
        const res = await api.post('/transactions/sell', {
          currencyFrom: currency.toUpperCase(),
          amountForeign: value,
        });
        Alert.alert(
          'Sukces',
          `Sprzedano za ${res.data.amountPln.toFixed(2)} PLN po kursie ${res.data.rate}`
        );
      }

      setAmount('');
    } catch (err) {
      console.log('ERR TRADE:', err?.response?.data || err.message);
      Alert.alert(
        'Błąd',
        err?.response?.data?.message ||
          'Nie udało się wykonać transakcji. Sprawdź saldo i kursy.'
      );
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Kup / sprzedaj walutę</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            borderWidth: 1,
            backgroundColor: mode === 'BUY' ? '#cceeff' : 'white',
          }}
          onPress={() => setMode('BUY')}
        >
          <Text style={{ textAlign: 'center' }}>Kupno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            borderWidth: 1,
            borderLeftWidth: 0,
            backgroundColor: mode === 'SELL' ? '#cceeff' : 'white',
          }}
          onPress={() => setMode('SELL')}
        >
          <Text style={{ textAlign: 'center' }}>Sprzedaż</Text>
        </TouchableOpacity>
      </View>

      <Text>Kod waluty (np. EUR, USD):</Text>
      <TextInput
        value={currency}
        onChangeText={setCurrency}
        autoCapitalize="characters"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Text>
        Kwota {mode === 'BUY' ? 'w PLN (do zapłaty)' : 'w walucie obcej (do sprzedaży)'}:
      </Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />

      <Button
        title={mode === 'BUY' ? 'Kup walutę' : 'Sprzedaj walutę'}
        onPress={handleSubmit}
      />
    </View>
  );
}
