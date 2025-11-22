import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import TransactionItem from '../components/TransactionItem';

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
    <TransactionItem
      type={item.type}
      currency_from={item.currency_from}
      currency_to={item.currency_to}
      amount={item.amount}
      rate={item.rate}
      created_at={item.created_at}
    />
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
