import { create } from 'zustand';
import type { Position, Sigil } from '@/types';

interface PositionsStore {
  // State
  positions: Position[];
  sigils: Sigil[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setPositions: (positions: Position[]) => void;
  setSigils: (sigils: Sigil[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: () => void;
  clear: () => void;
}

export const usePositionsStore = create<PositionsStore>((set) => ({
  positions: [],
  sigils: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  setPositions: (positions) =>
    set({
      positions,
      lastUpdated: new Date(),
    }),

  setSigils: (sigils) => set({ sigils }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  refresh: () => set({ lastUpdated: null }),

  clear: () =>
    set({
      positions: [],
      sigils: [],
      error: null,
      lastUpdated: null,
    }),
}));
