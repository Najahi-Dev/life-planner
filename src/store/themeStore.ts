import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeMode, AccentColor } from '@/types';
import {
  DARK_THEME_COLORS,
  LIGHT_THEME_COLORS,
  ACCENT_PALETTES,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SIZES,
  ANIMATION,
  SHADOWS,
} from '@/theme';
import { AppTheme } from '@/theme/types';

const THEME_MODE_KEY = '@lifeplanner/theme_mode';
const ACCENT_COLOR_KEY = '@lifeplanner/accent_color';

interface ThemeState {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  systemColorScheme: 'light' | 'dark';
  isHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setAccentColor: (color: AccentColor) => Promise<void>;
  setSystemColorScheme: (scheme: 'light' | 'dark') => void;
  hydrateTheme: () => Promise<void>;
  getTheme: () => AppTheme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'system',
  accentColor: 'indigo',
  systemColorScheme: Appearance.getColorScheme() === 'light' ? 'light' : 'dark',
  isHydrated: false,

  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    } catch {
      // Storage error
    }
  },

  setAccentColor: async (accent: AccentColor) => {
    set({ accentColor: accent });
    try {
      await AsyncStorage.setItem(ACCENT_COLOR_KEY, accent);
    } catch {
      // Storage error
    }
  },

  setSystemColorScheme: (scheme: 'light' | 'dark') => {
    set({ systemColorScheme: scheme });
  },

  hydrateTheme: async () => {
    try {
      const [savedMode, savedAccent] = await Promise.all([
        AsyncStorage.getItem(THEME_MODE_KEY),
        AsyncStorage.getItem(ACCENT_COLOR_KEY),
      ]);

      set({
        themeMode: (savedMode as ThemeMode) || 'system',
        accentColor: (savedAccent as AccentColor) || 'indigo',
        systemColorScheme: Appearance.getColorScheme() === 'light' ? 'light' : 'dark',
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },

  getTheme: (): AppTheme => {
    const { themeMode, accentColor, systemColorScheme } = get();
    const isDark =
      themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

    const colors = isDark ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
    const accent = ACCENT_PALETTES[accentColor] || ACCENT_PALETTES.indigo;

    return {
      isDark,
      themeMode,
      accentName: accentColor,
      colors,
      accent,
      spacing: SPACING,
      radius: RADIUS,
      typography: TYPOGRAPHY,
      sizes: SIZES,
      animation: ANIMATION,
      shadows: SHADOWS,
    };
  },
}));
