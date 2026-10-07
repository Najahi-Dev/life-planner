import { useThemeStore } from '@/store/themeStore';
import { AppTheme } from '@/theme/types';
import { ThemeMode, AccentColor } from '@/types';

export function useTheme(): AppTheme & {
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setAccentColor: (color: AccentColor) => Promise<void>;
  toggleTheme: () => Promise<void>;
} {
  const themeMode = useThemeStore((s) => s.themeMode);
  const accentColor = useThemeStore((s) => s.accentColor);
  const systemColorScheme = useThemeStore((s) => s.systemColorScheme);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const setAccentColor = useThemeStore((s) => s.setAccentColor);
  const getTheme = useThemeStore((s) => s.getTheme);

  const theme = getTheme();

  const toggleTheme = async () => {
    if (theme.isDark) {
      await setThemeMode('light');
    } else {
      await setThemeMode('dark');
    }
  };

  return {
    ...theme,
    setThemeMode,
    setAccentColor,
    toggleTheme,
  };
}
