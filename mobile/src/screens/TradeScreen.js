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
import { styles } from '../styles/globalStyles';

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
        const res = await api.post('/transactions/buy', {
          currencyTo: currency.toUpperCase(),
          amountPln: value,
        });
        Alert.alert(
          'Sukces',
          `Kupiono ${res.data.amountForeign.toFixed(2)} ${currency.toUpperCase()} po kursie ${res.data.rate}`
        );
      } else {
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
    <View style={styles.container}>
      <Text style={styles.title}>Kup / sprzedaj walutę</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              padding: 8,
              borderWidth: 1,
              borderColor: '#aac4f4',
              borderRadius: 8,
              marginRight: 4,
              backgroundColor: 'white',
            },
            mode === 'BUY' && { backgroundColor: '#cceeff' },
          ]}
          onPress={() => setMode('BUY')}
        >
          <Text style={{ textAlign: 'center' }}>Kupno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              padding: 8,
              borderWidth: 1,
              borderColor: '#aac4f4',
              borderRadius: 8,
              marginLeft: 4,
              backgroundColor: 'white',
            },
            mode === 'SELL' && { backgroundColor: '#cceeff' },
          ]}
          onPress={() => setMode('SELL')}
        >
          <Text style={{ textAlign: 'center' }}>Sprzedaż</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Kod waluty (np. EUR, USD)</Text>
      <TextInput
        style={styles.input}
        value={currency}
        onChangeText={setCurrency}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>
        Kwota {mode === 'BUY' ? 'w PLN (do zapłaty)' : 'w walucie obcej (do sprzedaży)'}
      </Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder={mode === 'BUY' ? 'np. 100' : 'np. 10'}
      />

      <Button
        title={mode === 'BUY' ? 'Kup walutę' : 'Sprzedaj walutę'}
        onPress={handleSubmit}
      />
    </View>
  );
}
