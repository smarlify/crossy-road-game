import { create } from 'zustand';
import { LeaderboardStore, LeaderboardEntry } from '@/types';
import { fetchLeaderboard, saveScore } from '@/services/leaderboardService';

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  entries: [],
  loading: false,
  error: null,


  addEntry: async (entry: Omit<LeaderboardEntry, 'timestamp'>) => {
    set({ loading: true, error: null });
    try {
      await saveScore('crossy-road', entry);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save score';
      set({ error: errorMessage, loading: false });
    }
  },
}));
