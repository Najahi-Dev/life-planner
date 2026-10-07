import { SPACING, RADIUS, TYPOGRAPHY, SIZES, ANIMATION, SHADOWS } from './tokens';
import { ThemeColors, AccentPalette } from './colors';
import { ThemeMode, AccentColor } from '@/types';

export interface AppTheme {
  isDark: boolean;
  themeMode: ThemeMode;
  accentName: AccentColor;
  colors: ThemeColors;
  accent: AccentPalette;
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  typography: typeof TYPOGRAPHY;
  sizes: typeof SIZES;
  animation: typeof ANIMATION;
  shadows: typeof SHADOWS;
}
