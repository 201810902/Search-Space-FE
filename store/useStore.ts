// eslint-disable-next-line prettier/prettier
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
interface StoreState {
  isLoggedIn: boolean;
  user: {
    email: string | null;
    nickName: string | null;
  };

  setLogin: (status: boolean) => void;
  setUser: (id: string, name: string) => void;
  logout: () => void;
}

export const useStore = create<StoreState>(set => ({
  //초기상태
  isLoggedIn: false,
  user: {
    email: null,
    nickName: null,
  },

  setLogin: status => set({ isLoggedIn: status }),
  setUser: (email, nickName) => set({ user: { email, nickName } }),
  logout: () =>
    set({
      isLoggedIn: false,
      user: { email: null, nickName: null },
    }),
}));
