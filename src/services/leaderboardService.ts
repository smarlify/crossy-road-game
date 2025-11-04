import { ref, push, query, orderByChild, limitToLast, get } from 'firebase/database';
import { database } from '@/config/firebase';
import { LeaderboardEntry } from '@/types';

const LEADERBOARD_LIMIT = 10; // Top 10 scores

/**
 * Save a game result to Firebase
 * Path: [gameName]/leaderboard/[entryId]
 */
export async function saveScore(
  gameName: string,
  entry: Omit<LeaderboardEntry, 'timestamp'>
): Promise<void> {
  try {
    const leaderboardRef = ref(database, `${gameName}/leaderboard`);
    const newEntry: LeaderboardEntry = {
      ...entry,
      timestamp: Date.now(),
    };

    await push(leaderboardRef, newEntry);
    console.log('Score saved successfully:', newEntry);
  } catch (error) {
    console.error('Error saving score to Firebase:', error);
    throw error;
  }
}

/**
 * Fetch top scores from Firebase for a specific game
 * Returns entries sorted by score (highest first)
 */
export async function fetchLeaderboard(gameName: string): Promise<LeaderboardEntry[]> {
  try {
    const leaderboardRef = ref(database, `${gameName}/leaderboard`);

    // Query to get top scores, ordered by score field
    const topScoresQuery = query(
      leaderboardRef,
      orderByChild('score'),
      limitToLast(LEADERBOARD_LIMIT)
    );

    const snapshot = await get(topScoresQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      entries.push({
        id: data.id,
        name: data.name,
        score: data.score,
        timestamp: data.timestamp,
      });
    });

    // Sort by score descending (highest first), then by timestamp (newest first)
    return entries.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.timestamp - a.timestamp;
    });
  } catch (error) {
    console.error('Error fetching leaderboard from Firebase:', error);
    throw error;
  }
}

/**
 * Get the rank of a specific score
 */
export function getScoreRank(entries: LeaderboardEntry[], score: number): number {
  const rank = entries.findIndex(entry => entry.score <= score);
  return rank === -1 ? entries.length + 1 : rank + 1;
}
