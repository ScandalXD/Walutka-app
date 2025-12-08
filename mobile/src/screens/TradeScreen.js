import React, { useState, useEffect } from 'react';
import {  View,  Text,  TextInput,  Alert,  TouchableOpacity,  Keyboard,  TouchableWithoutFeedback,  KeyboardAvoidingView,  Platform,  ScrollView } from 'react-native';
import api from '../api/apiClient';
import { styles } from '../styles/globalStyles';
import AppButton from '../components/AppButton';

export default function TradeScreen() {
  const [mode, setMode] = useState('BUY');
  const [currency, setCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');

  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const [codes, setCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoadingPortfolio(true);
      const res = await api.get('/wallet/portfolio');
      setPortfolio(res.data || []);
    } catch (err) {
      console.log('ERR PORTFOLIO (trade):', err?.response?.data || err.message);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const loadCodes = async () => {
    try {
      setLoadingCodes(true);
      const res = await api.get('/rates/current');
      const list = (res.data.rates || []).map((r) => r.code);
      setCodes(list);
    } catch (err) {
      console.log('ERR CODES (trade):', err?.response?.data || err.message);
    } finally {
      setLoadingCodes(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
    loadCodes();
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

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      return Alert.alert('Błąd', 'Podaj poprawną kwotę');
    }

    try {
      if (mode === 'BUY') {
        const res = await api.post('/transactions/buy', {
          currencyTo: currency.toUpperCase(),
          amountPln: value,
        });
        Alert.alert(
          'Sukces',
          `Kupiono ${res.data.amountForeign.toFixed(
            2
          )} ${currency.toUpperCase()} po kursie ${res.data.rate}`
        );
      } else {
        const res = await api.post('/transactions/sell', {
          currencyFrom: currency.toUpperCase(),
          amountForeign: value,
        });
        Alert.alert(
          'Sukces',
          `Sprzedano za ${res.data.amountPln.toFixed(
            2
          )} PLN po kursie ${res.data.rate}`
        );
      }
      setAmount('');
      loadPortfolio();
    } catch (err) {
      console.log('ERR TRADE:', err?.response?.data || err.message);
      Alert.alert(
        'Błąd',
        err?.response?.data?.message ||
          'Nie udało się wykonać transakcji. Sprawdź saldo i kursy.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Kup / sprzedaj walutę</Text>

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

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: '#aac4f4',
                  borderRadius: 8,
                  marginRight: 4,
                  backgroundColor: 'white',
                },
                mode === 'BUY' && { backgroundColor: '#cceeff' },
              ]}
              onPress={() => setMode('BUY')}
            >
              <Text style={{ textAlign: 'center' }}>Kupno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: '#aac4f4',
                  borderRadius: 8,
                  marginLeft: 4,
                  backgroundColor: 'white',
                },
                mode === 'SELL' && { backgroundColor: '#cceeff' },
              ]}
              onPress={() => setMode('SELL')}
            >
              <Text style={{ textAlign: 'center' }}>Sprzedaż</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Kwota{' '}
            {mode === 'BUY'
              ? 'w PLN (do zapłaty)'
              : 'w walucie obcej (do sprzedaży)'}
            :
          </Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder={mode === 'BUY' ? 'np. 100' : 'np. 10'}
          />

          <AppButton
            title={mode === 'BUY' ? 'Kup walutę' : 'Sprzedaj walutę'}
            onPress={handleSubmit}
          />

          <Text style={styles.label}>Kod waluty (np. EUR, USD):</Text>
          <TextInput
            style={styles.input}
            value={currency}
            onChangeText={setCurrency}
            autoCapitalize="characters"
          />

          <Text style={{ fontSize: 12, color: '#555' }}>Wybierz z listy:</Text>
          {loadingCodes ? (
            <Text>Ładowanie listy walut...</Text>
          ) : (
            <View style={styles.chipContainer}>
              {codes.map((code) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.chip,
                    currency.toUpperCase() === code && styles.chipSelected,
                  ]}
                  onPress={() => setCurrency(code)}
                >
                  <Text style={styles.chipText}>{code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
