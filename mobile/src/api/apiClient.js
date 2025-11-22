import axios from 'axios';
import Constants from 'expo-constants';

const getBaseURL = () => {
  if (__DEV__) {
    const host = Constants.expoConfig?.hostUri?.split(':')[0];
    const url = `http://${host}:3000/api`;
    console.log('API BASE URL (DEV):', url);
    return url;
  }
  console.log('API BASE URL (PROD):', prodUrl);
  return prodUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
