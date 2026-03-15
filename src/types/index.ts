export enum CyclePhase {
  Menstrual = "menstrual",
  Follicular = "follicular",
  Luteal = "luteal",
  PMS = "pms",
}

export interface Cycle {
  id: number;
  start_date: string; // ISO 8601 YYYY-MM-DD
  cycle_length: number;
  notes: string | null;
  created_at: string;
}

export interface MoodLog {
  id: number;
  date: string; // ISO 8601 YYYY-MM-DD
  mood_score: number; // 1-5
  notes: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface PhaseInfo {
  phase: CyclePhase;
  dayInPhase: number;
  totalPhaseDays: number;
  dayInCycle: number;
  totalCycleDays: number;
  isOverdue: boolean;
}

export interface DayProbability {
  day: number;
  probability: number;
}

export interface CyclePrediction {
  predicted: number;
  stdDev: number;
  distribution: DayProbability[];
}

export interface MoodPrediction {
  expected: number;
  badMoodProbability: number;
  confidence: "low" | "medium" | "high";
}

export interface MoodTrend {
  cycleDay: number;
  moodScore: number;
  date: string;
}

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

export interface PhaseDefinition {
  phase: CyclePhase;
  name: string;
  description: string;
  color: string;
  gradient: [string, string];
  icon: string;
}

export interface InsightCategory {
  id: string;
  title: string;
  icon: string;
  items: InsightItem[];
}

export interface InsightItem {
  id: string;
  title: string;
  content: string;
  phase?: CyclePhase;
}

export interface AppSettings {
  default_cycle_length: number;
  notifications_enabled: boolean;
  luteal_warning_days_before: number;
  pms_warning_days_before: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  default_cycle_length: 28,
  notifications_enabled: true,
  luteal_warning_days_before: 2,
  pms_warning_days_before: 2,
};
