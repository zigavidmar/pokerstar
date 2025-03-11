import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  id: string | null;
  username: string | null;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      username: null,
    }),
    {
      name: "gto-wizard-user-storage",
    }
  )
);
