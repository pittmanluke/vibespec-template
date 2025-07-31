/**
 * Firebase Feature Configuration
 * 
 * This file controls which Firebase services are enabled/disabled.
 * Useful for development without Firebase setup or when using alternative services.
 */

export const firebaseFeatures = {
  /**
   * Enable/disable Firebase Authentication
   * When disabled, mock authentication will be used
   */
  useAuthentication: process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH !== 'false',
  
  /**
   * Enable/disable Firestore Database
   * When disabled, localStorage will be used as a mock database
   */
  useFirestore: process.env.NEXT_PUBLIC_USE_FIRESTORE !== 'false',
  
  /**
   * Enable/disable Firebase Storage
   * When disabled, browser File API will be used
   */
  useStorage: process.env.NEXT_PUBLIC_USE_STORAGE !== 'false',
  
  /**
   * Enable/disable Firebase Emulators
   * Only relevant when other features are enabled
   */
  useEmulators: process.env.NEXT_PUBLIC_USE_EMULATORS === 'true',
  
  /**
   * Development mode flag
   * Shows development UI helpers like role switcher
   */
  isDevelopment: process.env.NODE_ENV === 'development',
} as const;

/**
 * Check if Firebase configuration is available
 */
export const hasFirebaseConfig = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];
  
  return requiredEnvVars.every(varName => !!process.env[varName]);
};

/**
 * Get feature status message
 */
export const getFeatureStatus = () => {
  const status = {
    auth: firebaseFeatures.useAuthentication ? 'Firebase' : 'Mock',
    database: firebaseFeatures.useFirestore ? 'Firestore' : 'LocalStorage',
    storage: firebaseFeatures.useStorage ? 'Firebase Storage' : 'Browser Storage',
  };
  
  return status;
};

export type FirebaseFeatures = typeof firebaseFeatures;