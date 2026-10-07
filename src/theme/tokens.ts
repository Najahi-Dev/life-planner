/**
 * Design Tokens: Spacing, Radius, Typography, Shadows & Animation Timings
 * Strict conformance to 8pt spacing grid and defined type scale.
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screenPadding: 20,
  cardPadding: 16,
} as const;

export const RADIUS = {
  xs: 6,
  sm: 8,
  input: 12,
  button: 12,
  card: 16,
  sheet: 24,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  display: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  captionMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  captionBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  badge: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
} as const;

export const SIZES = {
  buttonPrimaryHeight: 52,
  buttonSecondaryHeight: 44,
  inputHeight: 52,
  minTouchTarget: 44,
  avatarSm: 32,
  avatarMd: 44,
  avatarLg: 64,
  tabBarHeight: 64,
} as const;

export const ANIMATION = {
  instant: 150,
  quick: 200,
  normal: 250,
  relaxed: 350,
  scalePress: 0.97,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;
