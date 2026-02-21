import { MD3LightTheme, configureFonts } from "react-native-paper";

// ─── Material Design 3 Color Scheme ───
// Based on Angola flag colors — a dynamic, modern M3 palette
const colors = {
  // Primary — deep blue (confiança, governo)
  primary: "#1565C0",
  onPrimary: "#FFFFFF",
  primaryContainer: "#D1E4FF",
  onPrimaryContainer: "#001D36",

  // Secondary — teal (ação, progresso)
  secondary: "#00897B",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#A7F5EC",
  onSecondaryContainer: "#002019",

  // Tertiary — warm orange (energia, alerta)
  tertiary: "#EF6C00",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFDCC2",
  onTertiaryContainer: "#331200",

  // Error
  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",

  // Background & Surface
  background: "#F8FAFE",
  onBackground: "#1A1C1E",
  surface: "#F8FAFE",
  onSurface: "#1A1C1E",
  surfaceVariant: "#E0E2EC",
  onSurfaceVariant: "#44474E",
  surfaceDisabled: "rgba(26, 28, 30, 0.12)",
  onSurfaceDisabled: "rgba(26, 28, 30, 0.38)",

  // Outline
  outline: "#74777F",
  outlineVariant: "#C4C6D0",

  // Inverse
  inverseSurface: "#2F3033",
  inverseOnSurface: "#F1F0F4",
  inversePrimary: "#A0CAFD",

  // Elevation overlay
  elevation: {
    level0: "transparent",
    level1: "#F0F4FA",
    level2: "#E8EEF7",
    level3: "#E1E8F4",
    level4: "#DEE6F2",
    level5: "#D9E2F0",
  },

  // Scrim & Shadow
  shadow: "#000000",
  scrim: "#000000",
  backdrop: "rgba(47, 48, 51, 0.4)",
};

// ─── Custom extended colors for the app ───
export const appColors = {
  // Category colors
  infrastructure: "#00897B",
  security: "#EF6C00",
  health: "#1565C0",
  map: "#7C4DFF",

  // Urgency
  urgencyLow: "#2E7D32",
  urgencyMedium: "#F9A825",
  urgencyHigh: "#C62828",

  // Surface tones
  surfaceBright: "#FFFFFF",
  surfaceDim: "#DDE0E6",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F2F4F8",
  surfaceContainer: "#ECF0F6",
  surfaceContainerHigh: "#E6EAF0",
  surfaceContainerHighest: "#E0E4EA",
};

// ─── Typography (MD3 scale) ───
const fontConfig = {
  displayLarge: {
    fontFamily: "System",
    fontSize: 57,
    fontWeight: "400" as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: "System",
    fontSize: 45,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: "System",
    fontSize: 36,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: "System",
    fontSize: 28,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: "System",
    fontSize: 24,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: "System",
    fontSize: 22,
    fontWeight: "500" as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "500" as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "400" as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "400" as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "400" as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: "System",
    fontSize: 11,
    fontWeight: "500" as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// ─── Theme export ───
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 16,
};

export type AppTheme = typeof theme;
