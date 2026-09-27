import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      token: null,

      setAuth: (user, role, token) => set({ 
        user, 
        role, 
        token, 
        isAuthenticated: true 
      }),

      clearAuth: () => set({ 
        user: null, 
        role: null, 
        token: null, 
        isAuthenticated: false 
      }),

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'drive-deal-auth', // localStorage key
    }
  )
);

export default useAuthStore;
