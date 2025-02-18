import { create } from 'zustand';

interface ShortsState {
  watchTime: number;
  setWatchTime: (watchTime: number) => void;
  durationTime: number;
  setDurationTime: (durationTime: number) => void;
  resetWatchTime: () => void;
  resetDurationTime: () => void;
}

const useShortsStore = create<ShortsState>((set) => ({
  watchTime: 0,
  setWatchTime: (watchTime: number) => set({ watchTime }),
  durationTime: 0,
  setDurationTime: (durationTime: number) => set({ durationTime }),
  resetWatchTime: () => set({ watchTime: 0 }),
  resetDurationTime: () => set({ durationTime: 0 }),
}));

export default useShortsStore;
