import { create } from 'zustand';

type IProgressStore = {
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

export const useProgressStore = create<IProgressStore>(set => ({
  isAnimating: false,
  setIsAnimating: (isAnimating: boolean) => set(() => ({ isAnimating })),
}));
