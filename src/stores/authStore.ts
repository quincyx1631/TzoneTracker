import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, type User } from '../api/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    timezone: string;
    workingHours: { start: number; end: number };
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updateData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.login({ email, password });
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.message || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.register(userData);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.message || 'Registration failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        apiClient.logout().catch(console.error);
        set({
          user: null,
          error: null,
        });
      },

      updateProfile: async (updateData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.updateProfile(updateData);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.message || 'Profile update failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {        
        try {
          const response = await apiClient.getCurrentUser();
          
          if (response.success && response.data) {
            set({ user: response.data.user });
          } else {
            // Cookie is invalid, clear auth state
            set({ user: null });
          }
        } catch (error) {
          // Cookie is invalid, clear auth state
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
      // No need for onRehydrateStorage with httpOnly cookies
    }
  )
);
