import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/globalStyles';

export default function TransactionItem({
  type,
  currency_from,
  currency_to,
  amount,
  rate,
  created_at,
}) {
  return (
    <View style={styles.cardRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>
          {type} {currency_from} → {currency_to}
        </Text>
        <Text>
          Kwota: {amount} {currency_to || ''}
        </Text>
        <Text>
          Kurs: {rate ?? '-'}
        </Text>
        <Text style={{ fontSize: 11, color: '#666' }}>{created_at}</Text>
      </View>
    </View>
  );
}
