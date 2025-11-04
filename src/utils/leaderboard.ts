import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';

// Firebase config (provided)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_LEADERBOARD_API_KEY,
  authDomain: import.meta.env.VITE_LEADERBOARD_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_LEADERBOARD_PROJECT_ID,
  storageBucket: import.meta.env.VITE_LEADERBOARD_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_LEADERBOARD_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_LEADERBOARD_APP_ID
};

// Create a dedicated named app to avoid conflicts
const app = getApps().find(a => a.name === 'leaderboard') || initializeApp(firebaseConfig, 'leaderboard');
const db = getFirestore(app);
const auth = getAuth(app);
let currentUser: User | null = null;

async function ensureAuth(): Promise<void> {
  if (currentUser && currentUser.uid) return;
  await new Promise<void>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        resolve();
      } else {
        try {
          const cred = await signInAnonymously(auth);
          currentUser = cred.user;
        } catch {
          // ignore
        } finally {
          resolve();
        }
      }
    });
  });
}

export type GameId = 'crossy-road' | 'traffic-run';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  createdAt?: any;
}

export async function initializeLeaderboard(): Promise<void> {
  // Simple connection/auth test: sign in anonymously and log uid
  await ensureAuth();
  if (currentUser) {
    // Intentionally only log to console for diagnostics
    console.debug('[leaderboard] Authenticated uid:', currentUser.uid);
  }
}

export async function saveLeaderboardScore(gameId: GameId, entry: { userId: string; name: string; score: number }): Promise<void> {
  await ensureAuth();
  const col = collection(db, 'leaderboards', gameId, 'scores');
  await addDoc(col, {
    userId: entry.userId,
    name: entry.name,
    score: entry.score,
    createdAt: serverTimestamp(),
  });
}

export async function getTopScores(gameId: GameId, topN = 10): Promise<LeaderboardEntry[]> {
  await ensureAuth();
  const col = collection(db, 'leaderboards', gameId, 'scores');
  const q = query(col, orderBy('score', 'desc'), limit(topN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...(d.data() as LeaderboardEntry) }));
}
