import { isValidDate } from "./dateUtils";

export function validateMoodScore(score: number): boolean {
  return Number.isInteger(score) && score >= 1 && score <= 5;
}

export function validateCycleLength(length: number): boolean {
  return Number.isInteger(length) && length >= 21 && length <= 45;
}

export function validateDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  return isValidDate(date);
}

export function validateDateNotInFuture(date: string): boolean {
  if (!validateDateString(date)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date + "T00:00:00");
  return d <= today;
}

export function validateNotes(notes: string | null): boolean {
  if (notes === null) return true;
  return notes.length <= 500;
}
