import { create } from "zustand";
import type { User } from "firebase/auth";

interface UserState {
  user: User | null;
  profile: { name: string; age: number | null; conditions: string[] } | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserState["profile"]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}));
