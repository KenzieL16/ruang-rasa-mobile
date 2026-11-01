import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Priority 1: Read from .env via Expo Public Environment Variable
const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT

function getDefaultBaseUrl() {
  if (LOCAL_IP) {
    return `http://${LOCAL_IP}:${API_PORT}/api`;
  }
  return `http://localhost:${API_PORT}/api`;
}

export const PHYSICAL_DEVICE_URL = `http://${LOCAL_IP}:5000/api`;
export const DEFAULT_API_URL = getDefaultBaseUrl();

let currentBaseUrl = DEFAULT_API_URL;

export async function initApiConfig() {
  try {
    await AsyncStorage.removeItem('@ruang_rasa_api_url');
  } catch (_e) {
  }
  currentBaseUrl = DEFAULT_API_URL;
  return currentBaseUrl;
}

export function getApiBaseUrl() {
  return currentBaseUrl;
}

export async function setApiBaseUrl(url) {
  currentBaseUrl = normalizeUrl(url);
  return currentBaseUrl;
}

export async function apiRequest(path, options = {}) {
  const token = await AsyncStorage.getItem('@ruang_rasa_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const endpoint = path.startsWith('/') ? path : `/${path}`;
  const url = `${currentBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Request gagal dengan status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}
