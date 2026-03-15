import {
  format,
  parseISO,
  differenceInDays,
  addDays,
  isValid,
  startOfDay,
} from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d");
}

export function toISODate(date: Date): string {
  return format(startOfDay(date), "yyyy-MM-dd");
}

export function daysBetween(start: string | Date, end: string | Date): number {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  return differenceInDays(startOfDay(e), startOfDay(s));
}

export function addDaysToDate(date: string | Date, days: number): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return addDays(d, days);
}

export function isValidDate(date: string): boolean {
  const parsed = parseISO(date);
  return isValid(parsed);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function getCycleDay(startDate: string, currentDate?: string): number {
  const current = currentDate ?? todayISO();
  return daysBetween(startDate, current) + 1;
}
