import { UserProfile, UserSettings } from '@/types';
import { User as FirebaseUser } from 'firebase/auth';

export * from '../schemas/authSchemas';

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  user: FirebaseUser;
  profile: UserProfile;
}
