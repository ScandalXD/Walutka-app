import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { setAuthToken } from './src/api/apiClient';

export default function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setAuthToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setAuthToken(null);
  };

  return (
    <AppNavigator
      isLoggedIn={!!token}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}
