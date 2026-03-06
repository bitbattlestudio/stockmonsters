import { create } from 'zustand';

interface UIStore {
  // Modal state
  feedModalOpen: boolean;
  releaseModalOpen: boolean;
  selectedSigilId: string | null;

  // Actions
  openFeedModal: (sigilId: string) => void;
  openReleaseModal: (sigilId: string) => void;
  closeModals: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  feedModalOpen: false,
  releaseModalOpen: false,
  selectedSigilId: null,

  openFeedModal: (sigilId) =>
    set({
      feedModalOpen: true,
      selectedSigilId: sigilId,
    }),

  openReleaseModal: (sigilId) =>
    set({
      releaseModalOpen: true,
      selectedSigilId: sigilId,
    }),

  closeModals: () =>
    set({
      feedModalOpen: false,
      releaseModalOpen: false,
      selectedSigilId: null,
    }),
}));
