import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';

export default function RatesHistoryScreen() {
  const [currency, setCurrency] = useState('EUR');
  const [data, setData] = useState(null); // { code, currency, rates: [...] }
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    const code = currency.trim().toUpperCase();
    if (!code) return;

    try {
      setLoading(true);
      const res = await api.get(`/rates/history/${code}`);
      setData(res.data);
    } catch (err) {
      console.log('ERR HISTORY RATES:', err?.response?.data || err.message);
      Alert.alert(
        'Błąd',
        err?.response?.data?.message || 'Nie udało się pobrać danych'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archiwalne kursy waluty</Text>

      <Text style={styles.label}>Kod waluty (np. EUR, USD):</Text>
      <TextInput
        style={styles.input}
        value={currency}
        onChangeText={setCurrency}
        autoCapitalize="characters"
      />

      <Button title="Pobierz historię" onPress={loadHistory} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

      {data && !loading && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.subtitle}>
            {data.code} – {data.currency}
          </Text>
          <FlatList
            data={data.rates}
            keyExtractor={(item) => item.effectiveDate}
            renderItem={({ item }) => (
              <View style={styles.cardRow}>
                <Text>{item.effectiveDate}</Text>
                <Text>{item.mid}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
