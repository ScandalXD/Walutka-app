import React from 'react';
import { View, Button, Text } from 'react-native';

export default function DashboardScreen({ navigation, onLogout }) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Kantor mobilny – panel główny
      </Text>

      <Button
        title="Zasil konto (PLN)"
        onPress={() => navigation.navigate('WalletTopUp')}
      />
      <View style={{ height: 8 }} />
      <Button
        title="Aktualne kursy walut"
        onPress={() => navigation.navigate('Rates')}
      />
      <View style={{ height: 8 }} />
      <Button
        title="Portfel walutowy"
        onPress={() => navigation.navigate('Portfolio')}
      />
      <View style={{ height: 8 }} />
      <Button
        title="Historia transakcji"
        onPress={() => navigation.navigate('History')}
      />
      <View style={{ height: 16 }} />
      <Button title="Wyloguj" color="red" onPress={onLogout} />

      <View style={{ height: 8 }} />
      <Button title="Kup / sprzedaj walutę" onPress={() => navigation.navigate('Trade')} />
    </View>


  );
}
