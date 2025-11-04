import { create } from 'zustand';
import { LeaderboardStore, LeaderboardEntry } from '@/types';
import { fetchLeaderboard, saveScore } from '@/services/leaderboardService';

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  entries: [],
  loading: false,
  error: null,

  fetchLeaderboard: async (gameName: string) => {
    set({ loading: true, error: null });
    try {
      const entries = await fetchLeaderboard(gameName);
      set({ entries, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leaderboard';
      set({ error: errorMessage, loading: false });
    }
  },

  addEntry: async (gameName: string, entry: Omit<LeaderboardEntry, 'timestamp'>) => {
    set({ loading: true, error: null });
    try {
      await saveScore(gameName, entry);
      // Refresh leaderboard after adding new entry
      const entries = await fetchLeaderboard(gameName);
      set({ entries, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save score';
      set({ error: errorMessage, loading: false });
    }
  },

  clearLeaderboard: () => {
    set({ entries: [], error: null });
  },
}));
