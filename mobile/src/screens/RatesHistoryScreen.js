import React, { useState, useEffect } from 'react';
import {  View,  Text,  TextInput,  FlatList,  ActivityIndicator,  Alert,  TouchableOpacity } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import AppButton from '../components/AppButton';

export default function RatesHistoryScreen() {
  const [currency, setCurrency] = useState('EUR');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [codes, setCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  const loadCodes = async () => {
    try {
      setLoadingCodes(true);
      const res = await api.get('/rates/current');
      const list = (res.data.rates || []).map((r) => r.code);
      setCodes(list);
    } catch (err) {
      console.log(
        'ERR CODES (rates history):',
        err?.response?.data || err.message
      );
    } finally {
      setLoadingCodes(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

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

      <Text style={{ fontSize: 12, color: '#555' }}>Wybierz z listy:</Text>
      {loadingCodes ? (
        <Text>Ładowanie listy walut...</Text>
      ) : (
        <View style={styles.chipContainer}>
          {codes.map((code) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.chip,
                currency.toUpperCase() === code && styles.chipSelected,
              ]}
              onPress={() => setCurrency(code)}
            >
              <Text style={styles.chipText}>{code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <AppButton title="Pobierz historię" onPress={loadHistory} />

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
