import {
  Cycle,
  MoodLog,
  CyclePrediction,
  MoodPrediction,
  MoodTrend,
  LinearRegressionResult,
  DayProbability,
} from "../types";
import { daysBetween } from "../utils/dateUtils";

// --- Normal Distribution (Abramowitz & Stegun) ---

export function normalPdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x === mean ? 1 : 0;
  const z = (x - mean) / stdDev;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

export function normalCdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x >= mean ? 1 : 0;
  const z = (x - mean) / stdDev;
  // Abramowitz & Stegun approximation 7.1.26
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327; // 1/sqrt(2*pi)
  const p =
    d *
    Math.exp((-z * z) / 2) *
    (t *
      (0.31938153 +
        t *
          (-0.356563782 +
            t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))));
  return z >= 0 ? 1 - p : p;
}

// --- Linear Regression (OLS) ---

export function linearRegression(
  points: [number, number][],
): LinearRegressionResult {
  const n = points.length;
  if (n < 2) {
    return {
      slope: 0,
      intercept: points.length === 1 ? points[0][1] : 0,
      rSquared: 0,
    };
  }

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) {
    return { slope: 0, intercept: sumY / n, rSquared: 0 };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const meanY = sumY / n;
  let ssRes = 0,
    ssTot = 0;
  for (const [x, y] of points) {
    const predicted = slope * x + intercept;
    ssRes += (y - predicted) ** 2;
    ssTot += (y - meanY) ** 2;
  }
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

// --- Cycle Length Prediction ---

export function computeCycleLengths(cycles: Cycle[]): number[] {
  if (cycles.length < 2) return [];
  const sorted = [...cycles].sort((a, b) =>
    a.start_date.localeCompare(b.start_date),
  );
  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const days = daysBetween(sorted[i - 1].start_date, sorted[i].start_date);
    if (days > 0) lengths.push(days);
  }
  return lengths;
}

export function predictCycleLength(cycles: Cycle[]): CyclePrediction {
  const lengths = computeCycleLengths(cycles);

  if (lengths.length < 2) {
    // Not enough data: use default or single observed length
    const predicted = lengths.length === 1 ? lengths[0] : 28;
    const stdDev = 3;
    return {
      predicted,
      stdDev,
      distribution: buildDistribution(predicted, stdDev),
    };
  }

  // Linear regression: x = cycle index, y = cycle length
  const points: [number, number][] = lengths.map((len, i) => [i + 1, len]);
  const reg = linearRegression(points);

  // Predict next cycle length
  const nextIndex = lengths.length + 1;
  const predicted = Math.round(reg.slope * nextIndex + reg.intercept);

  // Standard deviation of residuals
  const residuals = points.map(([x, y]) => y - (reg.slope * x + reg.intercept));
  const meanResidual = residuals.reduce((a, b) => a + b, 0) / residuals.length;
  const variance =
    residuals.reduce((a, r) => a + (r - meanResidual) ** 2, 0) /
    residuals.length;
  const stdDev = Math.max(Math.sqrt(variance), 1);

  return {
    predicted: Math.max(predicted, 21),
    stdDev,
    distribution: buildDistribution(Math.max(predicted, 21), stdDev),
  };
}

function buildDistribution(mean: number, stdDev: number): DayProbability[] {
  const distribution: DayProbability[] = [];
  const rangeStart = Math.max(Math.floor(mean - 3 * stdDev), 21);
  const rangeEnd = Math.ceil(mean + 3 * stdDev);

  let totalProb = 0;
  for (let day = rangeStart; day <= rangeEnd; day++) {
    const prob = normalPdf(day, mean, stdDev);
    distribution.push({ day, probability: prob });
    totalProb += prob;
  }

  // Normalize to sum to 1
  if (totalProb > 0) {
    for (const entry of distribution) {
      entry.probability /= totalProb;
    }
  }

  return distribution;
}

// --- Mood Prediction ---

export function mapMoodsToCycleDays(
  moodLogs: MoodLog[],
  cycles: Cycle[],
): Map<number, number[]> {
  const sorted = [...cycles].sort((a, b) =>
    a.start_date.localeCompare(b.start_date),
  );
  const dayMap = new Map<number, number[]>();

  for (const log of moodLogs) {
    // Find which cycle this mood log belongs to
    let belongsCycle: Cycle | null = null;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (log.date >= sorted[i].start_date) {
        belongsCycle = sorted[i];
        break;
      }
    }
    if (!belongsCycle) continue;

    const cycleDay = daysBetween(belongsCycle.start_date, log.date) + 1;
    if (cycleDay < 1 || cycleDay > 45) continue;

    const existing = dayMap.get(cycleDay) ?? [];
    existing.push(log.mood_score);
    dayMap.set(cycleDay, existing);
  }

  return dayMap;
}

export function predictMoodForDay(
  day: number,
  moodLogs: MoodLog[],
  cycles: Cycle[],
): MoodPrediction | null {
  const dayMap = mapMoodsToCycleDays(moodLogs, cycles);
  const scores = dayMap.get(day);

  if (!scores || scores.length === 0) return null;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.length > 1
      ? scores.reduce((a, s) => a + (s - mean) ** 2, 0) / scores.length
      : 1;
  const stdDev = Math.sqrt(variance);

  // P(mood <= 2) using normal CDF
  const badMoodProbability = normalCdf(2.5, mean, Math.max(stdDev, 0.5));

  const confidence = getConfidenceLevel(cycles);

  return {
    expected: Math.round(mean * 10) / 10,
    badMoodProbability: Math.round(badMoodProbability * 100) / 100,
    confidence,
  };
}

export function getMoodTrend(moodLogs: MoodLog[], cycle: Cycle): MoodTrend[] {
  const trends: MoodTrend[] = [];
  for (const log of moodLogs) {
    if (log.date < cycle.start_date) continue;
    const cycleDay = daysBetween(cycle.start_date, log.date) + 1;
    if (cycleDay < 1 || cycleDay > cycle.cycle_length + 7) continue;
    trends.push({
      cycleDay,
      moodScore: log.mood_score,
      date: log.date,
    });
  }
  return trends.sort((a, b) => a.cycleDay - b.cycleDay);
}

export function getConfidenceLevel(cycles: Cycle[]): "low" | "medium" | "high" {
  if (cycles.length < 3) return "low";
  if (cycles.length <= 6) return "medium";
  return "high";
}
