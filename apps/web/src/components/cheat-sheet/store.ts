import { create } from 'zustand';

interface CheatSheetState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useCheatSheet = create<CheatSheetState>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
