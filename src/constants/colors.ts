// =========================================================================
// Aura Finance — Color Palette
// Source: screeens/aura_finance/DESIGN.md
// =========================================================================

export const Colors = {
  // Background & Surfaces
  background:              '#101319',
  surface:                 '#101319',
  surfaceDim:              '#101319',
  surfaceBright:           '#363940',
  surfaceContainerLowest:  '#0b0e14',
  surfaceContainerLow:     '#191c22',
  surfaceContainer:        '#1d2026',
  surfaceContainerHigh:    '#272a30',
  surfaceContainerHighest: '#32353b',
  surfaceVariant:          '#32353b',

  // On-surface text
  onBackground:   '#e1e2ea',
  onSurface:      '#e1e2ea',
  onSurfaceVariant: '#dcbed4',
  inverseSurface: '#e1e2ea',
  inverseOnSurface: '#2d3037',

  // Primary (Neon Magenta / Pink)
  primary:              '#ffabf3',
  onPrimary:            '#5b005b',
  primaryContainer:     '#ff00ff',
  onPrimaryContainer:   '#510051',
  inversePrimary:       '#a900a9',
  primaryFixed:         '#ffd7f5',
  primaryFixedDim:      '#ffabf3',
  onPrimaryFixed:       '#380038',
  onPrimaryFixedVariant:'#810081',
  surfaceTint:          '#ffabf3',

  // Secondary (Violet / Purple)
  secondary:               '#dcb8ff',
  onSecondary:             '#480081',
  secondaryContainer:      '#7701d0',
  onSecondaryContainer:    '#dcb7ff',
  secondaryFixed:          '#efdbff',
  secondaryFixedDim:       '#dcb8ff',
  onSecondaryFixed:        '#2c0051',
  onSecondaryFixedVariant: '#6700b5',

  // Tertiary (Orange / Amber)
  tertiary:               '#ffb77d',
  onTertiary:             '#4d2600',
  tertiaryContainer:      '#db7800',
  onTertiaryContainer:    '#452100',
  tertiaryFixed:          '#ffdcc3',
  tertiaryFixedDim:       '#ffb77d',
  onTertiaryFixed:        '#2f1500',
  onTertiaryFixedVariant: '#6e3900',

  // Error
  error:            '#ffb4ab',
  onError:          '#690005',
  errorContainer:   '#93000a',
  onErrorContainer: '#ffdad6',

  // Outline
  outline:        '#a4899d',
  outlineVariant: '#564052',

  // Gradients (as string arrays for LinearGradient)
  neonGradient:   ['#ff00ff', '#7701d0'] as [string, string],
  violetGradient: ['#7701d0', '#2c0051'] as [string, string],
  darkGradient:   ['#272a30', '#0b0e14'] as [string, string],
} as const;

export type ColorKey = keyof typeof Colors;
