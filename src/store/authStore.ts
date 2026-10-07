import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile, UserSettings } from '@/types';
import { authService } from '@/features/auth/services/authService';

const ONBOARDING_KEY = '@lifeplanner/onboarding_completed';

interface AuthStoreState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  onboardingCompleted: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  setOnboardingCompleted: (completed: boolean) => Promise<void>;
  initializeAuthSession: () => () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  profile: null,
  settings: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  onboardingCompleted: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setSettings: (settings) => set({ settings }),

  setOnboardingCompleted: async (completed: boolean) => {
    set({ onboardingCompleted: completed });
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
    } catch {
      // Storage error
    }
  },

  initializeAuthSession: () => {
    // 1. Check local onboarding status first
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      if (val === 'true') {
        set({ onboardingCompleted: true });
      }
    });

    // 2. Subscribe to Firebase Auth state listener
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        set({ user: firebaseUser, isAuthenticated: true, isLoading: false, isInitialized: true });

        // Load profile, settings, and seed initial Firestore data asynchronously
        try {
          const [profile, settings] = await Promise.all([
            authService.getUserProfile(firebaseUser.uid),
            authService.getUserSettings(firebaseUser.uid),
          ]);
          set({ profile, settings });

          // Auto-seed sample tasks, shifts, courses, exams, etc. if new
          const { seedUserDataToFirestore } = await import('@/services/firebase/seedFirestore');
          await seedUserDataToFirestore(firebaseUser.uid, firebaseUser.email || undefined, firebaseUser.displayName || undefined);
        } catch {
          // Keep offline state
        }
      } else {
        set({
          user: null,
          profile: null,
          settings: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    });

    return unsubscribe;
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        profile: null,
        settings: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
