import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../styles/globalStyles';

export default function DashboardScreen({ navigation, onLogout }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kantor mobilny</Text>
      <Text style={{ marginBottom: 12, color: '#4b5563', fontSize: 14 }}>
        Wybierz jedną z dostępnych opcji, aby zarządzać swoim portfelem
        walutowym.
      </Text>

      <View style={styles.menuSection}>
        <Text style={styles.subtitle}>Operacje na koncie</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('WalletTopUp')}
        >
          <Text style={styles.menuButtonText}>Zasil konto (PLN) – PayU</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Trade')}
        >
          <Text style={styles.menuButtonText}>Kup / sprzedaj walutę</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.subtitle}>Kursy walut</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Rates')}
        >
          <Text style={styles.menuButtonText}>Aktualne kursy walut</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('RatesHistory')}
        >
          <Text style={styles.menuButtonText}>Archiwalne kursy walut</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.subtitle}>Twój portfel</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Portfolio')}
        >
          <Text style={styles.menuButtonText}>Stan portfela walutowego</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.menuButtonText}>Historia transakcji</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.menuSection, { marginBottom: 24 }]}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#ef4444', borderColor: '#b91c1c' }]}
          onPress={onLogout}
        >
          <Text style={[styles.menuButtonText, { color: 'white' }]}>
            Wyloguj
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
