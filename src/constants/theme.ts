import { CyclePhase } from "../types";

export const PHASE_COLORS: Record<
  CyclePhase,
  { primary: string; light: string; gradient: [string, string] }
> = {
  [CyclePhase.Menstrual]: {
    primary: "#E74C3C",
    light: "#FADBD8",
    gradient: ["#E74C3C", "#FADBD8"],
  },
  [CyclePhase.Follicular]: {
    primary: "#2ECC71",
    light: "#D5F5E3",
    gradient: ["#2ECC71", "#D5F5E3"],
  },
  [CyclePhase.Luteal]: {
    primary: "#F39C12",
    light: "#FDEBD0",
    gradient: ["#F39C12", "#FDEBD0"],
  },
  [CyclePhase.PMS]: {
    primary: "#9B59B6",
    light: "#E8DAEF",
    gradient: ["#9B59B6", "#E8DAEF"],
  },
};

export const COLORS = {
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#2C3E50",
  textSecondary: "#7F8C8D",
  border: "#E0E0E0",
  error: "#E74C3C",
  success: "#2ECC71",
  warning: "#F39C12",
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
  full: 999,
};
