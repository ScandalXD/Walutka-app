import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import WalletTopUpScreen from '../screens/WalletTopUpScreen';
import RatesScreen from '../screens/RatesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import TradeScreen from '../screens/TradeScreen';
import RatesHistoryScreen from '../screens/RatesHistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isLoggedIn, onLogin, onLogout }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" options={{ title: 'Logowanie' }}>
              {(props) => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Register" options={{ title: 'Rejestracja' }}>
              {(props) => <RegisterScreen {...props} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" options={{ title: 'Kantor mobilny' }}>
              {(props) => <DashboardScreen {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="WalletTopUp"
              component={WalletTopUpScreen}
              options={{ title: 'Zasilenie konta' }}
            />
            <Stack.Screen
               name="Trade"
               component={TradeScreen}
               options={{ title: 'Kup / sprzedaj walutę' }}
/>
            <Stack.Screen
              name="Rates"
              component={RatesScreen}
              options={{ title: 'Kursy walut' }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: 'Historia transakcji' }}
            />
            <Stack.Screen
              name="Portfolio"
              component={PortfolioScreen}
              options={{ title: 'Portfel walutowy' }}
            />
            <Stack.Screen
              name="RatesHistory"
              component={RatesHistoryScreen}
              options={{ title: 'Archiwalne kursy' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
