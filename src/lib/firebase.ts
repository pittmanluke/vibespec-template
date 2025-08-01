// Firebase configuration
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseFeatures, hasFirebaseConfig } from '@/config/firebase.config';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX'
};

// Initialize Firebase app conditionally
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize if we have valid config and features are enabled
if (hasFirebaseConfig() || firebaseFeatures.isDevelopment) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize Auth if enabled
    if (firebaseFeatures.useAuthentication && app) {
      auth = getAuth(app);
    }
    
    // Initialize Firestore if enabled
    if (firebaseFeatures.useFirestore && app) {
      db = getFirestore(app);
    }
  } catch (error) {
    console.warn('Firebase initialization error:', error);
    // Continue without Firebase in development
    if (!firebaseFeatures.isDevelopment) {
      throw error;
    }
  }
}

// Connect to Firestore emulator in development, test, or if FIRESTORE_EMULATOR_HOST is set
// if (
//   process.env.NODE_ENV === 'development' ||
//   process.env.NODE_ENV === 'test' ||
//   process.env.FIRESTORE_EMULATOR_HOST
// ) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectStorageEmulator(getStorage(app), 'localhost', 9199);
// }

// Initialize Storage if enabled
let storage: FirebaseStorage | null = null;
if (firebaseFeatures.useStorage && app) {
  storage = getStorage(app);
}

// Log feature status in development (only once per environment)
if (firebaseFeatures.isDevelopment && typeof window !== 'undefined') {
  // Client-side only logging using sessionStorage as a flag
  const logKey = 'firebase-status-logged';
  if (!sessionStorage.getItem(logKey)) {
    sessionStorage.setItem(logKey, 'true');
    console.log('🔥 Firebase Feature Status:', {
      auth: auth ? 'Initialized' : 'Disabled',
      firestore: db ? 'Initialized' : 'Disabled', 
      storage: storage ? 'Initialized' : 'Disabled',
    });
  }
}

export { app, auth, db, storage }; 