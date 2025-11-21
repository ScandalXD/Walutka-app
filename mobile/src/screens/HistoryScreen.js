import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/apiClient';

export default function HistoryScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions/history');
      setItems(res.data); // список транзакций
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
    <View
      style={{
        paddingVertical: 6,
        borderBottomWidth: 0.5,
      }}
    >
      <Text>
        {item.type} {item.currency_from} → {item.currency_to}
      </Text>
      <Text>
        Kwota: {item.amount} kurs: {item.rate ?? '-'}
      </Text>
      <Text style={{ fontSize: 12, color: 'grey' }}>{item.created_at}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Historia transakcji</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.transaction_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
