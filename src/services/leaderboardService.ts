import { LeaderboardEntry } from '@/types';
import {
  saveLeaderboardScore,
} from '@/utils/leaderboard';


/**
 * Save a game result to Firestore
 * Path: leaderboards/[gameName]/scores/[docId]
 */
export async function saveScore(
  gameName: string,
  entry: Omit<LeaderboardEntry, 'timestamp'>
): Promise<void> {
  try {
    await saveLeaderboardScore(gameName as string, {
      id: entry.id,
      name: entry.name,
      score: entry.score,
    });
    console.log('Score saved successfully:', entry);
  } catch (error) {
    console.error('Error saving score to Firestore:', error);
    throw error;
  }
}

