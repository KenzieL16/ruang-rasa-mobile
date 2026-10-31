import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { identifyUser } from '../utils/logrocket';
import { apiRequest, initApiConfig } from '../config/api';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  refreshProfile: async () => { },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        await initApiConfig();
        const savedToken = await AsyncStorage.getItem('@ruang_rasa_token');
        const savedUser = await AsyncStorage.getItem('@ruang_rasa_user');

        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);

          // Verify token with backend in background
          try {
            const meRes = await apiRequest('/auth/me');
            if (meRes.success && meRes.data) {
              setUser(meRes.data);
              await AsyncStorage.setItem('@ruang_rasa_user', JSON.stringify(meRes.data));
              // Identifikasi user di LogRocket
              try {
                identifyUser(meRes.data._id || meRes.data.email, {
                  name: meRes.data.name,
                  email: meRes.data.email,
                  role: meRes.data.role,
                });
              } catch (_lr) { }
            }
          } catch (_err) {
            // If token expired (401), force logout
            if (_err.status === 401) {
              await AsyncStorage.multiRemove(['@ruang_rasa_token', '@ruang_rasa_user']);
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (e) {
        console.error('Gagal membaca sesi auth:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadAuth();
  }, []);

  async function login(email, password, requireAdmin = false) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.success || !res.data) {
      throw new Error(res.message || 'Login gagal.');
    }

    const { token: userToken, user: userData } = res.data;

    if (requireAdmin && userData.role !== 'admin') {
      throw new Error('Akun ini bukan akun admin.');
    }

    setToken(userToken);
    setUser(userData);

    await AsyncStorage.setItem('@ruang_rasa_token', userToken);
    await AsyncStorage.setItem('@ruang_rasa_user', JSON.stringify(userData));

    // Identifikasi user di LogRocket setelah login
    try {
      identifyUser(userData._id || userData.email, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } catch (_lr) { }

    return userData;
  }

  async function register(name, email, password, phone) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (!res.success || !res.data) {
      throw new Error(res.message || 'Registrasi gagal.');
    }

    const { token: userToken, user: userData } = res.data;

    setToken(userToken);
    setUser(userData);

    await AsyncStorage.setItem('@ruang_rasa_token', userToken);
    await AsyncStorage.setItem('@ruang_rasa_user', JSON.stringify(userData));

    // Identifikasi user di LogRocket setelah register
    try {
      identifyUser(userData._id || userData.email, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } catch (_lr) { }

    return userData;
  }

  async function logout() {
    try {
      await AsyncStorage.multiRemove(['@ruang_rasa_token', '@ruang_rasa_user']);
    } catch (_e) {
      // ignore
    }
    setToken(null);
    setUser(null);
  }

  async function refreshProfile() {
    try {
      const res = await apiRequest('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
        await AsyncStorage.setItem('@ruang_rasa_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.error('Refresh profile error:', e);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

