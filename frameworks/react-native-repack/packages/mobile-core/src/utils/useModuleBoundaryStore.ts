import {create} from 'zustand';

export const useModuleBoundaryStore = create<{
  isEnabled: boolean;
  toggle: () => void;
}>(set => ({
  isEnabled: false,
  toggle: () => set(state => ({isEnabled: !state.isEnabled})),
}));
