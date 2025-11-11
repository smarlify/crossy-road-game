import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Firestore
export const firestore = getFirestore(app);

// Get the current user's display name from Firebase
export function getCurrentUserDisplayName(): string | null {
  const user = auth.currentUser;
  return user?.displayName || null;
}

// Sign in with Google
export async function signInWithGooglePopup(): Promise<string | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const displayName = result.user.displayName;
    console.log('Signed in as:', displayName);
    return displayName;
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  }
}

// Check if user is logged in with Google (not anonymous)
export function isUserLoggedIn(): boolean {
  const user = auth.currentUser;
  return user !== null && !user.isAnonymous;
}
