import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useCounterStore = create(
  combine(
    {
      count: 0,
    },
    set => ({
      increase: () => set(state => ({ count: state.count + 1 })),
      decrease: () => set(state => ({ count: state.count - 1 })),
    }),
  ),
);
