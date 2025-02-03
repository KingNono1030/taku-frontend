import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { UserDetail } from '@/types/api/user.types';

interface UserState {
  user: UserDetail | null;
  token: string | null;
  setUser: (user: UserDetail) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  isLoggedIn: () => boolean;
}

// 간단한 인코딩/디코딩 함수
const encode = (data: string): string => {
  return btoa(encodeURIComponent(data));
};

const decode = (data: string): string => {
  return decodeURIComponent(atob(data));
};

// 커스텀 스토리지
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      return JSON.parse(decode(str));
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, encode(JSON.stringify(value)));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (user: UserDetail) => set({ user }),

      setToken: (token: string) => set({ token }),

      clearUser: () => {
        set({
          user: null,
          token: null,
        });
        localStorage.removeItem('user-storage');
      },

      isLoggedIn: () => {
        const state = get();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export default useUserStore;
