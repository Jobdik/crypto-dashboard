import { create } from 'zustand';

export const useDepositStorage = create((set) => ({
  showDeposit: false,
  setShowDeposit: (value) => set({ showDeposit: value }),
  toggleDeposit: () => set((state) => ({ showDeposit: !state.showDeposit })),
}));