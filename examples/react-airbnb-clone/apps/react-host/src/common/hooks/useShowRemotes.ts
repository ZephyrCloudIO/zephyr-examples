import { create } from 'zustand';

interface ShowRemotesStore {
  show: boolean;
  toggle: () => void;
}

const useShowRemotes = create<ShowRemotesStore>((set) => ({
  show: false,
  toggle: () => set(({ show }) => ({ show: !show })),
}));

export default useShowRemotes;
