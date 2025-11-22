import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// This would typically be a more complex type based on your database schema
type User = {
  id: string;
  name: string;
  email: string;
};

interface UserState {
  user: User | null;
  organizationId: string | null;
  setUser: (user: User | null) => void;
  setOrganizationId: (organizationId: string | null) => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      organizationId: null,
      setUser: (user) => set({ user }),
      setOrganizationId: (organizationId) => set({ organizationId }),
    }),
    {
      name: "user-storage", // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);
