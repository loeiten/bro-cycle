import { CyclePhase } from "../types";

export const PHASE_COLORS: Record<
  CyclePhase,
  { primary: string; light: string; gradient: [string, string] }
> = {
  [CyclePhase.Menstrual]: {
    primary: "#EF4444",
    light: "#FEE2E2",
    gradient: ["#EF4444", "#FCA5A5"],
  },
  [CyclePhase.Follicular]: {
    primary: "#22C55E",
    light: "#DCFCE7",
    gradient: ["#22C55E", "#86EFAC"],
  },
  [CyclePhase.Luteal]: {
    primary: "#F97316",
    light: "#FFF7ED",
    gradient: ["#F97316", "#FDBA74"],
  },
  [CyclePhase.PMS]: {
    primary: "#A855F7",
    light: "#F3E8FF",
    gradient: ["#A855F7", "#D8B4FE"],
  },
};

export const COLORS = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceElevated: "#F1F5F9",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F97316",
  accent: "#38BDF8",
};

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  }),
};

export const GRADIENTS = {
  screenBackground: ["#F8FAFC", "#E2E8F0", "#F8FAFC"] as const,
  warmCard: ["#FFFFFF", "#F1F5F9"] as const,
  buttonPrimary: ["#22C55E", "#16A34A"] as const,
  buttonDanger: ["#EF4444", "#DC2626"] as const,
  buttonAccent: ["#38BDF8", "#0EA5E9"] as const,
  onboardingHero: ["#DCFCE7", "#E0F2FE", "#F8FAFC"] as const,
  tabBar: ["#F1F5F9", "#F8FAFC"] as const,
  phaseHero: {
    [CyclePhase.Menstrual]: ["#FEE2E2", "#F8FAFC"] as const,
    [CyclePhase.Follicular]: ["#DCFCE7", "#F8FAFC"] as const,
    [CyclePhase.Luteal]: ["#FFF7ED", "#F8FAFC"] as const,
    [CyclePhase.PMS]: ["#F3E8FF", "#F8FAFC"] as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
};
