import { create } from 'zustand';
import { resetPlayerStore } from '@/logic/playerLogic';
import { useMapStore } from '@/store/mapStore';
import { useUserStore } from '@/store/userStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { DEFAULT_GAME_STATE } from '@/utils/constants';
import { GameStore } from '@/types';
import { trackGamePlayed, trackMaxLevel } from '@/utils/analytics';
import { initializeFirebaseAuth } from '@/utils/firebase';

// GA tracking helper
const trackEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
) => {
  if (typeof window !== 'undefined' && window.trackEvent) {
    window.trackEvent(eventName, parameters);
  }
};

// Initialize Firebase and track game played on initial load
if (typeof window !== 'undefined') {
  const initializeAndTrack = async () => {
    // Initialize Firebase auth (creates anonymous user if needed)
    await initializeFirebaseAuth();
    
    // Track game play
    await trackGamePlayed();
  };
  
  initializeAndTrack();
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_GAME_STATE,
  playCount: 0,
  totalCornCollected: 0,
  pause: () => {
    set({ isPaused: true });
    trackEvent('game_pause', {
      game_id: 'crossy_road',
      game_name: 'Crossy Road',
      event_category: 'game_interaction',
    });
  },
  resume: () => {
    set({ isPaused: false });
    trackEvent('game_resume', {
      game_id: 'crossy_road',
      game_name: 'Crossy Road',
      event_category: 'game_interaction',
    });
  },
  updateScore: (rowIndex: number) => {
    const state = get();
    const newScore = Math.max(rowIndex, state.score);
    set({ score: newScore });

    // Track max level achievement
    if (newScore > state.score) {
      trackMaxLevel(newScore);
    }

    // Track score milestones
    if (newScore > state.score && newScore % 10 === 0) {
      trackEvent('score_milestone', {
        game_id: 'crossy_road',
        game_name: 'Crossy Road',
        score: newScore,
        milestone: newScore,
        event_category: 'game_interaction',
      });
    }
  },
  incrementCorn: () => {
    const state = get();
    const newCornCount = state.cornCount + 1;
    const newTotalCorn = state.totalCornCollected + 1;
    set({ cornCount: newCornCount, totalCornCollected: newTotalCorn });

    trackEvent('corn_collected', {
      game_id: 'crossy_road',
      game_name: 'Crossy Road',
      corn_count: newCornCount,
      total_corn_collected: newTotalCorn,
      event_category: 'game_interaction',
    });
  },
  setCheckpoint: (row: number, tile: number) =>
    set(() => ({ checkpointRow: row, checkpointTile: tile })),
  setStatus: (status: 'running' | 'over' | 'paused') => set({ status }),
  setPaused: (paused: boolean) => set({ isPaused: paused }),
  endGame: () => {
    const state = get();
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
    trackEvent('game_over', {
      game_id: 'crossy_road',
      game_name: 'Crossy Road',
      final_score: state.score,
      corn_collected: state.cornCount,
      total_corn_collected: state.totalCornCollected,
      play_count: state.playCount,
      event_category: 'game_interaction',
    });

    // Send game over message to parent iframe
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'GAME_OVER',
        gameName: 'Crossy Road',
        score: state.score,
        level: undefined,
        cornCollected: state.cornCount,
        totalCornCollected: state.totalCornCollected
      }, '*');
    }
  },
  reset: () => {
    const state = get();
    const newPlayCount = state.playCount + 1;

    trackEvent('game_restart', {
      game_id: 'crossy_road',
      game_name: 'Crossy Road',
      play_count: newPlayCount,
      restart_method: 'keyboard',
      event_category: 'game_interaction',
    });

    useMapStore.getState().reset();
    resetPlayerStore();
    set({
      ...DEFAULT_GAME_STATE,
      playCount: newPlayCount,
      totalCornCollected: state.totalCornCollected,
    });
  },
}));
