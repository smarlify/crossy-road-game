import { create } from 'zustand';
import { UserStore, UserData } from '../types';

const USER_STORAGE_KEY = 'crossy-road-user';

// Generate a unique ID using timestamp and random number
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Load user data from localStorage
function loadUserData(): UserData | null {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return null;
}

// Save user data to localStorage
function saveUserData(userData: UserData): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

export const useUserStore = create<UserStore>((set) => ({
  userData: loadUserData(),

  setUserName: (name: string) => {
    const userData: UserData = {
      id: generateUserId(),
      name: name.trim(),
    };
    saveUserData(userData);
    set({ userData });
  },

  clearUser: () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
    set({ userData: null });
  },
}));
