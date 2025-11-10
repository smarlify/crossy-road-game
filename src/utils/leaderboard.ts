import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

export async function saveLeaderboardScore(
  entry: { id: string; name: string; score: number }
): Promise<void> {
  console.log('🎮 Starting leaderboard save...');
  console.log('Entry data:', entry);

  const col = collection(firestore, 'leaderboards', 'crossy-road', 'scores');
  console.log('Firestore collection path: leaderboards/crossy-road/scores');

  const dataToSave = {
    id: entry.id,
    name: entry.name,
    score: entry.score,
    createdAt: Timestamp.now(),
  };

  console.log('📤 Data being sent to Firestore:', dataToSave);

  try {
    const docRef = await addDoc(col, dataToSave);
    console.log('✅ Score saved successfully! Doc ID:', docRef.id);
  } catch (error) {
    console.error('❌ Error saving to Firestore:', error);
    throw error;
  }
}
