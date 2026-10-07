import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDummyApiKeyForLifePlanner123456789',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'lifeplanner-app-prod.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'lifeplanner-app-prod',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'lifeplanner-app-prod.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '102938475610',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:102938475610:web:abcdef1234567890',
  ...(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ? { measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID } : {}),
};

// Check if actual valid Firebase credentials are provided
export const isFirebaseConfigured =
  !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
  !process.env.EXPO_PUBLIC_FIREBASE_API_KEY.includes('DummyApiKey');

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get React Native persistence without triggering invalid subpath export warnings
function getAuthPersistence() {
  if (Platform.OS === 'web') {
    return browserLocalPersistence;
  }
  try {
    const authModule = require('firebase/auth');
    if (typeof authModule.getReactNativePersistence === 'function') {
      return authModule.getReactNativePersistence(AsyncStorage);
    }
  } catch {
    // Fallback to default persistence
  }
  return undefined;
}

// Initialize Auth with cross-platform persistence
let authInstance;
try {
  const persistence = getAuthPersistence();
  authInstance = persistence
    ? initializeAuth(app, { persistence })
    : getAuth(app);
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;

// Initialize Firestore with platform-appropriate cache and robust connection handling
export const db = initializeFirestore(app, {
  localCache:
    Platform.OS === 'web'
      ? persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        })
      : memoryLocalCache(),
  experimentalAutoDetectLongPolling: true,
});
