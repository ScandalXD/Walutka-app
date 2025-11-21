import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/apiClient';

export default function PortfolioScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wallet/portfolio');
      setItems(res.data); // [{ currency_code, amount }, ...]
    } catch (err) {
      console.log('ERR PORTFOLIO:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Twój portfel walut</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            item.currency_code + '_' + index.toString()
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 6,
                borderBottomWidth: 0.5,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.currency_code}</Text>
              <Text>{item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
