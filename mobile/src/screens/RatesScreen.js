import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import RateItem from '../components/RateItem';

export default function RatesScreen() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);

  const loadRates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rates/current');
      setRates(res.data.rates || []);
      setDate(res.data.effectiveDate);
    } catch (err) {
      console.log('ERR RATES:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktualne kursy walut</Text>

      <Button title="Odśwież kursy" onPress={loadRates} />

      {date && <Text style={{ marginTop: 8 }}>Data tabeli: {date}</Text>}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          style={{ marginTop: 12 }}
          data={rates}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <RateItem
              code={item.code}
              mid={item.mid}
              currencyName={item.currency}
            />
          )}
        />
      )}
    </View>
  );
}
