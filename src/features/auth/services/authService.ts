import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/services/firebase/config';
import { UserProfile, UserSettings } from '@/types';
import { LoginFormData, RegisterFormData, ProfileUpdateFormData } from '../schemas/authSchemas';

export const authService = {
  /**
   * Subscribe to Firebase Auth state transitions
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Sign in with Email and Password
   */
  async loginWithEmail(data: LoginFormData): Promise<{ user: FirebaseUser; profile: UserProfile }> {
    const credential = await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
    const user = credential.user;

    let profile = await this.getUserProfile(user.uid);
    if (!profile) {
      profile = await this.createInitialUserProfile(user, user.displayName || 'Planner User');
    }

    return { user, profile };
  },

  /**
   * Register a new user with Email, Password and Display Name
   */
  async registerWithEmail(data: RegisterFormData): Promise<{ user: FirebaseUser; profile: UserProfile }> {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email.trim(),
      data.password,
    );
    const user = credential.user;

    // Update Firebase Auth profile displayName
    await updateFirebaseProfile(user, {
      displayName: data.displayName.trim(),
    });

    // Create Firestore profile & default settings
    const profile = await this.createInitialUserProfile(user, data.displayName.trim());
    await this.createInitialUserSettings(user.uid);

    return { user, profile };
  },

  /**
   * Instant Demo / Guest Login for development & quick evaluation
   */
  async loginWithDemoAccount(): Promise<{ user: FirebaseUser; profile: UserProfile }> {
    const demoEmail = 'demo@lifeplanner.app';
    const demoPassword = 'Password123!';

    try {
      return await this.loginWithEmail({ email: demoEmail, password: demoPassword });
    } catch (error: any) {
      // If demo account does not exist in Firebase Auth yet, register it
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
        return await this.registerWithEmail({
          email: demoEmail,
          password: demoPassword,
          confirmPassword: demoPassword,
          displayName: 'Alex Rivers',
        });
      }
      throw error;
    }
  },

  /**
   * Send Password Reset Email
   */
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  /**
   * Sign Out
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Fetch User Profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const profileRef = doc(db, 'users', uid, 'profile', 'main');
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Create Initial User Profile in Firestore
   */
  async createInitialUserProfile(user: FirebaseUser, displayName: string): Promise<UserProfile> {
    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: user.uid,
      userId: user.uid,
      email: user.email || '',
      displayName: displayName || 'Planner User',
      photoURL: user.photoURL || null,
      phoneNumber: user.phoneNumber || null,
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    };

    const profileRef = doc(db, 'users', user.uid, 'profile', 'main');
    await setDoc(profileRef, profile, { merge: true });
    return profile;
  },

  /**
   * Fetch or Create Default User Settings
   */
  async getUserSettings(uid: string): Promise<UserSettings> {
    try {
      const settingsRef = doc(db, 'users', uid, 'settings', 'default');
      const snap = await getDoc(settingsRef);
      if (snap.exists()) {
        return snap.data() as UserSettings;
      }
    } catch {
      // Return defaults if offline or first fetch
    }
    return await this.createInitialUserSettings(uid);
  },

  /**
   * Initialize Default Settings in Firestore
   */
  async createInitialUserSettings(uid: string): Promise<UserSettings> {
    const now = new Date().toISOString();
    const defaultSettings: UserSettings = {
      id: 'default',
      userId: uid,
      themeMode: 'system',
      accentColor: 'indigo',
      pushEnabled: true,
      smsEnabled: false,
      phoneVerified: false,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      defaultReminderLeadMinutes: 15,
      weekStartDay: 'monday',
      createdAt: now,
      updatedAt: now,
    };

    try {
      const settingsRef = doc(db, 'users', uid, 'settings', 'default');
      await setDoc(settingsRef, defaultSettings, { merge: true });
    } catch {
      // Offline fallback
    }

    return defaultSettings;
  },

  /**
   * Update Profile Data in Firestore
   */
  async updateUserProfile(uid: string, data: Partial<ProfileUpdateFormData>): Promise<void> {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    await updateDoc(profileRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Update User Settings in Firestore
   */
  async updateUserSettings(uid: string, data: Partial<UserSettings>): Promise<void> {
    const settingsRef = doc(db, 'users', uid, 'settings', 'default');
    await updateDoc(settingsRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },
};
