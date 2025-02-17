import { create } from 'zustand';

interface ShortsState {
  watchTime: number;
  setWatchTime: (watchTime: number) => void;
  resetWatchTime: () => void;
}

const useShortsStore = create<ShortsState>((set) => ({
  watchTime: 0,
  setWatchTime: (watchTime: number) => set({ watchTime }),
  resetWatchTime: () => set({ watchTime: 0 }),
}));

export default useShortsStore;
