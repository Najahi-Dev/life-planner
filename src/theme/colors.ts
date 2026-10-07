import { AccentColor } from '@/types';

export interface AccentPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primarySoft: string;
  gradient: [string, string];
  onPrimary: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
  indigo: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    primarySoft: 'rgba(99, 102, 241, 0.14)',
    gradient: ['#6366F1', '#4F46E5'],
    onPrimary: '#FFFFFF',
  },
  emerald: {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    primarySoft: 'rgba(16, 185, 129, 0.14)',
    gradient: ['#10B981', '#059669'],
    onPrimary: '#FFFFFF',
  },
  rose: {
    primary: '#F43F5E',
    primaryLight: '#FB7185',
    primaryDark: '#E11D48',
    primarySoft: 'rgba(244, 63, 94, 0.14)',
    gradient: ['#F43F5E', '#E11D48'],
    onPrimary: '#FFFFFF',
  },
  amber: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    primaryDark: '#D97706',
    primarySoft: 'rgba(245, 158, 11, 0.14)',
    gradient: ['#F59E0B', '#D97706'],
    onPrimary: '#FFFFFF',
  },
  sky: {
    primary: '#0EA5E9',
    primaryLight: '#38BDF8',
    primaryDark: '#0284C7',
    primarySoft: 'rgba(14, 165, 233, 0.14)',
    gradient: ['#0EA5E9', '#0284C7'],
    onPrimary: '#FFFFFF',
  },
};

export const SEMANTIC_COLORS = {
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.14)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.14)',
  error: '#EF4444',
  errorSoft: 'rgba(239, 68, 68, 0.14)',
  info: '#3B82F6',
  infoSoft: 'rgba(59, 130, 246, 0.14)',
};

export const PRIORITY_COLORS = {
  low: {
    color: '#10B981',
    background: 'rgba(16, 185, 129, 0.14)',
    label: 'Low',
  },
  medium: {
    color: '#3B82F6',
    background: 'rgba(59, 130, 246, 0.14)',
    label: 'Medium',
  },
  high: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.14)',
    label: 'High',
  },
  urgent: {
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.14)',
    label: 'Urgent',
  },
};

export const CATEGORY_COLORS = {
  work: {
    color: '#3B82F6',
    background: 'rgba(59, 130, 246, 0.14)',
    label: 'Work',
  },
  personal: {
    color: '#8B5CF6',
    background: 'rgba(139, 92, 246, 0.14)',
    label: 'Personal',
  },
  study: {
    color: '#10B981',
    background: 'rgba(16, 185, 129, 0.14)',
    label: 'Study',
  },
  uni: {
    color: '#EC4899',
    background: 'rgba(236, 72, 153, 0.14)',
    label: 'University',
  },
  health: {
    color: '#14B8A6',
    background: 'rgba(20, 184, 166, 0.14)',
    label: 'Health',
  },
  finance: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.14)',
    label: 'Finance',
  },
};

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceHover: string;
  card: string;
  cardElevated: string;
  cardBorder: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  icon: string;
  iconSecondary: string;
  inputBackground: string;
  inputBorder: string;
  inputBorderFocus: string;
  sheetBackground: string;
  sheetHandle: string;
  tabBarBackground: string;
  tabBarBorder: string;
  overlay: string;
  shimmerBase: string;
  shimmerHighlight: string;
  divider: string;
}

export const DARK_THEME_COLORS: ThemeColors = {
  background: '#090D16',
  surface: '#0F172A',
  surfaceSubtle: '#1E293B',
  surfaceHover: '#334155',
  card: '#131D31',
  cardElevated: '#1E293B',
  cardBorder: '#1E293B',
  border: '#1E293B',
  borderSubtle: '#0F172A',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  textInverse: '#090D16',
  icon: '#F8FAFC',
  iconSecondary: '#94A3B8',
  inputBackground: '#131D31',
  inputBorder: '#1E293B',
  inputBorderFocus: '#6366F1',
  sheetBackground: '#0F172A',
  sheetHandle: '#475569',
  tabBarBackground: 'rgba(15, 23, 42, 0.94)',
  tabBarBorder: '#1E293B',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shimmerBase: '#1E293B',
  shimmerHighlight: '#334155',
  divider: '#1E293B',
};

export const LIGHT_THEME_COLORS: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceHover: '#E2E8F0',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardBorder: '#E2E8F0',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  icon: '#0F172A',
  iconSecondary: '#64748B',
  inputBackground: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputBorderFocus: '#6366F1',
  sheetBackground: '#FFFFFF',
  sheetHandle: '#CBD5E1',
  tabBarBackground: 'rgba(255, 255, 255, 0.94)',
  tabBarBorder: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.4)',
  shimmerBase: '#E2E8F0',
  shimmerHighlight: '#F8FAFC',
  divider: '#E2E8F0',
};
