import { create } from 'zustand';
import { LeaderboardStore, LeaderboardEntry } from '@/types';
import { saveScore } from '@/services/leaderboardService';

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  loading: false,
  error: null,

  addEntry: async (gameName: string, entry: Omit<LeaderboardEntry, 'timestamp'>) => {
    set({ loading: true, error: null });
    try {
      await saveScore(gameName, entry);
      set({ loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save score';
      set({ error: errorMessage, loading: false });
    }
  },
}));
