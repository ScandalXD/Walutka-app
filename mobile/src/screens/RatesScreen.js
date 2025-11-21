import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import api from '../api/apiClient';

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
      console.log(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Odśwież kursy" onPress={loadRates} />
      {date && (
        <Text style={{ marginVertical: 8 }}>Data tabeli: {date}</Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={rates}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 4,
              }}
            >
              <Text>{item.code}</Text>
              <Text>{item.mid}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
