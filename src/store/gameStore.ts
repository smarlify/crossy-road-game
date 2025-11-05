import { create } from 'zustand';
import { resetPlayerStore } from '@/logic/playerLogic';
import { useMapStore } from '@/store/mapStore';
import { useUserStore } from '@/store/userStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { DEFAULT_GAME_STATE } from '@/utils/constants';
import { GameStore } from '@/types';

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_GAME_STATE,
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  updateScore: (rowIndex: number) => {
    set(state => ({ score: Math.max(rowIndex, state.score) }));
  },
  incrementCorn: () => set(state => ({ cornCount: state.cornCount + 1 })),
  setCheckpoint: (row: number, tile: number) =>
    set(() => ({ checkpointRow: row, checkpointTile: tile })),
  setStatus: (status: 'running' | 'over' | 'paused') => set({ status }),
  setPaused: (paused: boolean) => set({ isPaused: paused }),
  endGame: () => {
    set({ status: 'over' });

    // Save score to Firebase if user has provided their name
    const userData = useUserStore.getState().userData;
    const score = get().score;

    if (userData && score > 0) {
      const leaderboardStore = useLeaderboardStore.getState();
      leaderboardStore.addEntry({
        id: userData.id,
        name: userData.name,
        score: score,
      }).catch(error => {
        console.error('Failed to save score to leaderboard:', error);
      });
    }
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set(DEFAULT_GAME_STATE);
  },
}));
