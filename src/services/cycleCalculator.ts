import { addDays, parseISO, format } from "date-fns";
import { CyclePhase, PhaseInfo, Cycle } from "../types";
import { getCycleDay } from "../utils/dateUtils";

export function getPhaseForDay(day: number, cycleLength: number): CyclePhase {
  const menstrualEnd = Math.floor(cycleLength / 4);
  const follicularEnd = Math.floor(cycleLength / 2);
  const lutealEnd = Math.floor((3 * cycleLength) / 4);

  if (day <= menstrualEnd) return CyclePhase.Menstrual;
  if (day <= follicularEnd) return CyclePhase.Follicular;
  if (day <= lutealEnd) return CyclePhase.Luteal;
  return CyclePhase.PMS;
}

export function getPhaseBoundaries(
  cycleLength: number,
): Record<CyclePhase, { start: number; end: number }> {
  const menstrualEnd = Math.floor(cycleLength / 4);
  const follicularEnd = Math.floor(cycleLength / 2);
  const lutealEnd = Math.floor((3 * cycleLength) / 4);

  return {
    [CyclePhase.Menstrual]: { start: 1, end: menstrualEnd },
    [CyclePhase.Follicular]: { start: menstrualEnd + 1, end: follicularEnd },
    [CyclePhase.Luteal]: { start: follicularEnd + 1, end: lutealEnd },
    [CyclePhase.PMS]: { start: lutealEnd + 1, end: cycleLength },
  };
}

export function getCurrentPhaseInfo(
  cycle: Cycle,
  currentDate?: string,
): PhaseInfo {
  const dayInCycle = getCycleDay(cycle.start_date, currentDate);
  const isOverdue = dayInCycle > cycle.cycle_length;

  const effectiveDay = isOverdue ? cycle.cycle_length : dayInCycle;
  const phase = getPhaseForDay(effectiveDay, cycle.cycle_length);
  const boundaries = getPhaseBoundaries(cycle.cycle_length);
  const phaseBounds = boundaries[phase];

  const dayInPhase = effectiveDay - phaseBounds.start + 1;
  const totalPhaseDays = phaseBounds.end - phaseBounds.start + 1;

  return {
    phase,
    dayInPhase,
    totalPhaseDays,
    dayInCycle,
    totalCycleDays: cycle.cycle_length,
    isOverdue,
  };
}

export function getExpectedPeriodDate(cycle: Cycle): string {
  const start = parseISO(cycle.start_date);
  const expected = addDays(start, cycle.cycle_length);
  return format(expected, "yyyy-MM-dd");
}

export function getDaysUntilPhase(
  cycle: Cycle,
  targetPhase: CyclePhase,
  currentDate?: string,
): number | null {
  const dayInCycle = getCycleDay(cycle.start_date, currentDate);
  const boundaries = getPhaseBoundaries(cycle.cycle_length);
  const targetStart = boundaries[targetPhase].start;

  if (dayInCycle >= targetStart) return null; // Already past or in this phase
  return targetStart - dayInCycle;
}
