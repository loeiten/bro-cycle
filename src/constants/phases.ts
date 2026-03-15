import { CyclePhase, PhaseDefinition } from "../types";

export const PHASE_DEFINITIONS: Record<CyclePhase, PhaseDefinition> = {
  [CyclePhase.Menstrual]: {
    phase: CyclePhase.Menstrual,
    name: "Menstrual",
    description: "Bleeding phase. Energy is lower, rest is important.",
    color: "#E74C3C",
    gradient: ["#E74C3C", "#FADBD8"],
    icon: "water",
  },
  [CyclePhase.Follicular]: {
    phase: CyclePhase.Follicular,
    name: "Follicular",
    description: "Feel-good phase. Rising estrogen boosts energy and mood.",
    color: "#2ECC71",
    gradient: ["#2ECC71", "#D5F5E3"],
    icon: "sunny",
  },
  [CyclePhase.Luteal]: {
    phase: CyclePhase.Luteal,
    name: "Luteal",
    description: "Mood shifts may begin. Progesterone rises, energy may dip.",
    color: "#F39C12",
    gradient: ["#F39C12", "#FDEBD0"],
    icon: "cloud",
  },
  [CyclePhase.PMS]: {
    phase: CyclePhase.PMS,
    name: "PMS",
    description:
      "Premenstrual phase. Significant mood and physical changes possible.",
    color: "#9B59B6",
    gradient: ["#9B59B6", "#E8DAEF"],
    icon: "thunderstorm",
  },
};

export const PHASE_ORDER: CyclePhase[] = [
  CyclePhase.Menstrual,
  CyclePhase.Follicular,
  CyclePhase.Luteal,
  CyclePhase.PMS,
];
