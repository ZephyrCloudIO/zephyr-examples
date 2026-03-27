import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {MmkvStorage} from '../../utils/mmkvStorage';

type AuthStore = {
  user: string | null;
  login: (user: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>(
  // @ts-ignore
  persist(
    set => ({
      user: null,
      login: (user: string) => {
        set({user});
      },
      logout: () => set({user: null}),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => MmkvStorage),
    },
  ),
);
