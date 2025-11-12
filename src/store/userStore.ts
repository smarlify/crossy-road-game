import { create } from 'zustand';
import { UserStore, UserData } from '../types';
import { getCurrentUserEmail, getCurrentUserDisplayName } from '../config/firebase';

export const useUserStore = create<UserStore>((set) => ({
  userData: null,

  setUserName: (name: string, email: string) => {
    const userData: UserData = {
      id: email,
      name: name.trim(),
    };
    set({ userData });
  },

  clearUser: () => {
    set({ userData: null });
  },

  getGoogleEmail: () => {
    return getCurrentUserEmail();
  },

  getGoogleDisplayName: () => {
    return getCurrentUserDisplayName();
  },
}));
