import React, { useState, useEffect } from 'react';
import { View,  Text,  TextInput,  Alert,  Keyboard,  TouchableWithoutFeedback,  TouchableOpacity } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import * as WebBrowser from 'expo-web-browser';
import AppButton from '../components/AppButton';

export default function WalletTopUpScreen() {
  const [amount, setAmount] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoadingPortfolio(true);
      const res = await api.get('/wallet/portfolio');
      setPortfolio(res.data || []);
    } catch (err) {
      console.log('ERR PORTFOLIO (topup):', err?.response?.data || err.message);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const plnBalance =
    portfolio.find((p) => p.currency_code === 'PLN')?.amount ?? 0;

  const showPortfolioDetails = () => {
    if (!portfolio || portfolio.length === 0) {
      return Alert.alert('Stan portfela', 'Brak środków w portfelu.');
    }

    const lines = portfolio.map(
      (p) => `${p.currency_code}: ${Number(p.amount).toFixed(2)}`
    );

    Alert.alert('Stan portfela', lines.join('\n'));
  };

  const performPayUTopup = async (value) => {
    try {
      const res = await api.post('/payments/payu/create', { amount: value });
      const redirectUri = res.data.redirectUri;

      if (!redirectUri) {
        return Alert.alert('Błąd', 'Brak adresu płatności PayU');
      }

      await WebBrowser.openBrowserAsync(redirectUri);

      await api.post('/wallet/topup', { amount: value });

      Alert.alert(
        'Sukces',
        'Konto zostało zasilone po płatności PayU (sandbox – wirtualne środki)'
      );
      setAmount('');
      loadPortfolio();
    } catch (err) {
      console.log('ERR PAYU:', err?.response?.data || err.message);
      Alert.alert(
        'Błąd',
        err?.response?.data?.message ||
          'Nie udało się utworzyć płatności PayU (sandbox)'
      );
    }
  };

  const handleTopUpPayU = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      return Alert.alert('Błąd', 'Podaj poprawną kwotę w PLN');
    }

    Alert.alert(
      'Potwierdzenie',
      `Czy na pewno chcesz zasilić konto kwotą ${value.toFixed(
        2
      )} PLN przez PayU (sandbox)?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Tak', onPress: () => performPayUTopup(value) },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Zasilenie konta (PLN)</Text>

        <TouchableOpacity onPress={showPortfolioDetails} activeOpacity={0.8}>
          <View style={styles.infoBox}>
            <Text>Aktualny stan portfela:</Text>
            {loadingPortfolio ? (
              <Text>Ładowanie...</Text>
            ) : (
              <Text style={{ fontWeight: 'bold' }}>
                PLN: {plnBalance.toFixed(2)}
              </Text>
            )}
            <Text style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
              Dotknij, aby zobaczyć szczegóły portfela
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Kwota w PLN</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="np. 100"
        />

        <AppButton
          title="Doładuj przez PayU (sandbox)"
          onPress={handleTopUpPayU}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
