import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  nickName?: string | null;
  email: string | null;
  gender: 'male' | 'female' | 'other' | null;
  birthday: Date | null;
  profileImage?: string | null;
  phoneNumber?: string | null;
  locationInfoUseAgreement: boolean;
}
interface UserStore {
  user: User;
  isAuthenticated: boolean;

  //@액션
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  login: (user: User) => void;
  logout: () => void;
}

const initialState: User = {
  email: null,
  nickName: null,
  profileImage: null,
  gender: null,
  birthday: null,
  phoneNumber: null,
  locationInfoUseAgreement: false,
};

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: initialState,
      isAuthenticated: false,

      setUser: (user: User) => set({ user, isAuthenticated: true }),
      updateUser: userData =>
        set(state => ({
          user: { ...state.user, ...userData },
        })),
      login: user => set({ user, isAuthenticated: true }),
      logout: () => set({ user: initialState, isAuthenticated: false }),
    }),
    {
      name: 'user-stroage',
    },
  ),
);
