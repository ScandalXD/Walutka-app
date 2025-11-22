import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/globalStyles';

export default function RateItem({ code, mid, currencyName, date }) {
  return (
    <View style={styles.cardRow}>
      <View>
        <Text style={{ fontWeight: 'bold' }}>{code}</Text>
        {currencyName && (
          <Text style={{ fontSize: 11, color: '#666' }}>{currencyName}</Text>
        )}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text>{mid}</Text>
        {date && (
          <Text style={{ fontSize: 11, color: '#666' }}>{date}</Text>
        )}
      </View>
    </View>
  );
}
