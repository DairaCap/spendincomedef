// =========================================================================
// Aura Finance — Typography & Spacing Theme
// =========================================================================

export const Typography = {
  displayLg: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    fontFamily: 'Inter_700Bold',
  },
  headlineLg: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600' as const,
    letterSpacing: -0.32,
    fontFamily: 'Inter_600SemiBold',
  },
  headlineLgMobile: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  titleMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    fontFamily: 'Inter_400Regular',
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    fontFamily: 'Inter_400Regular',
  },
  labelCaps: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.6,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase' as const,
  },
};

export const Spacing = {
  one:   4,
  two:   8,
  three: 12,
  four:  16,
  five:  20,
  six:   24,
  eight: 32,
  containerMargin: 20,
  stackGap:        16,
  sectionGap:      32,
};

export const Radius = {
  sm:   8,
  DEFAULT: 16,
  md:   24,
  lg:   32,
  xl:   48,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  neon: {
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Legacy exports kept for backward-compatibility with existing code
export const MaxContentWidth = 640;
export const BottomTabInset  = 80;
