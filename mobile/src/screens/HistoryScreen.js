import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';

export default function HistoryScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions/history');
      setItems(res.data || []);
    } catch (err) {
      console.log('ERR HISTORY:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>
          {item.type} {item.currency_from} → {item.currency_to}
        </Text>
        <Text>
          Kwota: {item.amount}  |  Kurs: {item.rate ?? '-'}
        </Text>
        <Text style={{ fontSize: 11, color: 'grey' }}>{item.created_at}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia transakcji</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          style={{ marginTop: 12 }}
          data={items}
          keyExtractor={(item) => item.transaction_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
