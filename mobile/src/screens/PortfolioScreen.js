import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';

export default function PortfolioScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wallet/portfolio');
      setItems(res.data || []);
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
    <View style={styles.container}>
      <Text style={styles.title}>Twój portfel walut</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          style={{ marginTop: 12 }}
          data={items}
          keyExtractor={(item, index) =>
            item.currency_code + '_' + index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.cardRow}>
              <Text style={{ fontWeight: 'bold' }}>{item.currency_code}</Text>
              <Text>{item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
