import {
  normalPdf,
  normalCdf,
  linearRegression,
  computeCycleLengths,
  predictCycleLength,
  mapMoodsToCycleDays,
  predictMoodForDay,
  getMoodTrend,
  getConfidenceLevel,
} from "../../src/services/predictionEngine";
import { Cycle, MoodLog } from "../../src/types";

const makeCycle = (startDate: string, cycleLength = 28, id = 1): Cycle => ({
  id,
  start_date: startDate,
  cycle_length: cycleLength,
  notes: null,
  created_at: "2024-01-01T00:00:00",
});

const makeMoodLog = (date: string, score: number, id = 1): MoodLog => ({
  id,
  date,
  mood_score: score,
  notes: null,
  created_at: "2024-01-01T00:00:00",
});

describe("predictionEngine", () => {
  describe("normalPdf", () => {
    it("returns max at mean", () => {
      const atMean = normalPdf(28, 28, 2);
      const offMean = normalPdf(30, 28, 2);
      expect(atMean).toBeGreaterThan(offMean);
    });

    it("is symmetric around mean", () => {
      const left = normalPdf(26, 28, 2);
      const right = normalPdf(30, 28, 2);
      expect(left).toBeCloseTo(right, 10);
    });

    it("handles zero stdDev", () => {
      expect(normalPdf(28, 28, 0)).toBe(1);
      expect(normalPdf(27, 28, 0)).toBe(0);
    });
  });

  describe("normalCdf", () => {
    it("returns ~0.5 at mean", () => {
      expect(normalCdf(28, 28, 2)).toBeCloseTo(0.5, 2);
    });

    it("returns ~0.9772 at mean + 2*stdDev", () => {
      expect(normalCdf(32, 28, 2)).toBeCloseTo(0.9772, 2);
    });

    it("returns ~0.0228 at mean - 2*stdDev", () => {
      expect(normalCdf(24, 28, 2)).toBeCloseTo(0.0228, 2);
    });

    it("handles zero stdDev", () => {
      expect(normalCdf(29, 28, 0)).toBe(1);
      expect(normalCdf(27, 28, 0)).toBe(0);
    });
  });

  describe("linearRegression", () => {
    it("finds perfect positive slope", () => {
      const result = linearRegression([
        [1, 2],
        [2, 4],
        [3, 6],
      ]);
      expect(result.slope).toBeCloseTo(2, 5);
      expect(result.intercept).toBeCloseTo(0, 5);
      expect(result.rSquared).toBeCloseTo(1, 5);
    });

    it("finds flat line", () => {
      const result = linearRegression([
        [1, 28],
        [2, 28],
        [3, 28],
      ]);
      expect(result.slope).toBeCloseTo(0, 5);
      expect(result.intercept).toBeCloseTo(28, 5);
    });

    it("handles single point", () => {
      const result = linearRegression([[1, 28]]);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(28);
    });

    it("handles empty array", () => {
      const result = linearRegression([]);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(0);
    });

    it("handles identical x values", () => {
      const result = linearRegression([
        [1, 28],
        [1, 30],
      ]);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(29);
    });
  });

  describe("computeCycleLengths", () => {
    it("returns empty for single cycle", () => {
      expect(computeCycleLengths([makeCycle("2024-01-01")])).toEqual([]);
    });

    it("computes lengths from consecutive cycles", () => {
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-01-29", 28, 2),
        makeCycle("2024-02-26", 28, 3),
      ];
      const lengths = computeCycleLengths(cycles);
      expect(lengths).toEqual([28, 28]);
    });

    it("computes varying lengths", () => {
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-01-30", 28, 2), // 29 days
        makeCycle("2024-02-26", 28, 3), // 27 days
      ];
      const lengths = computeCycleLengths(cycles);
      expect(lengths).toEqual([29, 27]);
    });

    it("handles unordered cycles", () => {
      const cycles = [
        makeCycle("2024-02-26", 28, 3),
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-01-29", 28, 2),
      ];
      const lengths = computeCycleLengths(cycles);
      expect(lengths).toEqual([28, 28]);
    });
  });

  describe("predictCycleLength", () => {
    it("returns default 28 with no cycles", () => {
      const result = predictCycleLength([]);
      expect(result.predicted).toBe(28);
      expect(result.stdDev).toBe(3);
      expect(result.distribution.length).toBeGreaterThan(0);
    });

    it("returns observed length with 2 cycles", () => {
      const cycles = [
        makeCycle("2024-01-01", 30, 1),
        makeCycle("2024-01-31", 30, 2), // 30 days
      ];
      const result = predictCycleLength(cycles);
      expect(result.predicted).toBe(30);
    });

    it("uses regression with many cycles", () => {
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-01-29", 28, 2),
        makeCycle("2024-02-26", 28, 3),
        makeCycle("2024-03-25", 28, 4),
      ];
      const result = predictCycleLength(cycles);
      expect(result.predicted).toBeGreaterThanOrEqual(1);
      expect(result.distribution.length).toBeGreaterThan(0);
      // Distribution should sum to ~1
      const total = result.distribution.reduce((s, d) => s + d.probability, 0);
      expect(total).toBeCloseTo(1, 1);
    });

    it("predicted length can be below 21 for short cycles", () => {
      // Create cycles with decreasing lengths to push prediction low
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-01-20", 28, 2), // 19 days
        makeCycle("2024-02-05", 28, 3), // 16 days
      ];
      const result = predictCycleLength(cycles);
      expect(result.predicted).toBeGreaterThanOrEqual(1);
      expect(result.predicted).toBeLessThan(21);
    });

    it("distribution has at least 8 bars even with small stdDev", () => {
      // Two cycles with identical spacing → stdDev = 1 (minimum)
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-01-29", 28, 2),
        makeCycle("2024-02-26", 28, 3),
      ];
      const result = predictCycleLength(cycles);
      expect(result.distribution.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe("mapMoodsToCycleDays", () => {
    it("maps mood logs to correct cycle days", () => {
      const cycles = [makeCycle("2024-03-01", 28, 1)];
      const moods = [
        makeMoodLog("2024-03-01", 3, 1),
        makeMoodLog("2024-03-05", 2, 2),
      ];
      const map = mapMoodsToCycleDays(moods, cycles);
      expect(map.get(1)).toEqual([3]);
      expect(map.get(5)).toEqual([2]);
    });

    it("aggregates across cycles", () => {
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-02-01", 28, 2),
      ];
      const moods = [
        makeMoodLog("2024-01-01", 3, 1), // Day 1 of cycle 1
        makeMoodLog("2024-02-01", 4, 2), // Day 1 of cycle 2
      ];
      const map = mapMoodsToCycleDays(moods, cycles);
      expect(map.get(1)).toEqual([3, 4]);
    });

    it("ignores moods before any cycle", () => {
      const cycles = [makeCycle("2024-03-01", 28, 1)];
      const moods = [makeMoodLog("2024-02-15", 3, 1)];
      const map = mapMoodsToCycleDays(moods, cycles);
      expect(map.size).toBe(0);
    });
  });

  describe("predictMoodForDay", () => {
    it("returns null when no data for that day", () => {
      const cycles = [makeCycle("2024-03-01", 28, 1)];
      const result = predictMoodForDay(10, [], cycles);
      expect(result).toBeNull();
    });

    it("returns prediction with data", () => {
      const cycles = [
        makeCycle("2024-01-01", 28, 1),
        makeCycle("2024-02-01", 28, 2),
      ];
      const moods = [
        makeMoodLog("2024-01-01", 2, 1),
        makeMoodLog("2024-02-01", 3, 2),
      ];
      const result = predictMoodForDay(1, moods, cycles);
      expect(result).not.toBeNull();
      expect(result!.expected).toBeCloseTo(2.5, 1);
      expect(result!.badMoodProbability).toBeGreaterThanOrEqual(0);
      expect(result!.badMoodProbability).toBeLessThanOrEqual(1);
    });
  });

  describe("getMoodTrend", () => {
    it("returns mood trend for a cycle", () => {
      const cycle = makeCycle("2024-03-01", 28, 1);
      const moods = [
        makeMoodLog("2024-03-01", 3, 1),
        makeMoodLog("2024-03-10", 4, 2),
        makeMoodLog("2024-03-20", 2, 3),
      ];
      const trend = getMoodTrend(moods, cycle);
      expect(trend).toHaveLength(3);
      expect(trend[0].cycleDay).toBe(1);
      expect(trend[0].moodScore).toBe(3);
      expect(trend[2].cycleDay).toBe(20);
    });

    it("excludes moods before cycle start", () => {
      const cycle = makeCycle("2024-03-01", 28, 1);
      const moods = [makeMoodLog("2024-02-28", 3, 1)];
      const trend = getMoodTrend(moods, cycle);
      expect(trend).toHaveLength(0);
    });

    it("sorts by cycle day", () => {
      const cycle = makeCycle("2024-03-01", 28, 1);
      const moods = [
        makeMoodLog("2024-03-10", 4, 2),
        makeMoodLog("2024-03-01", 3, 1),
      ];
      const trend = getMoodTrend(moods, cycle);
      expect(trend[0].cycleDay).toBeLessThan(trend[1].cycleDay);
    });
  });

  describe("getConfidenceLevel", () => {
    it("returns low for < 3 cycles", () => {
      expect(getConfidenceLevel([])).toBe("low");
      expect(getConfidenceLevel([makeCycle("2024-01-01")])).toBe("low");
      expect(
        getConfidenceLevel([makeCycle("2024-01-01"), makeCycle("2024-02-01")]),
      ).toBe("low");
    });

    it("returns medium for 3-6 cycles", () => {
      const cycles = Array.from({ length: 5 }, (_, i) =>
        makeCycle(`2024-0${i + 1}-01`, 28, i + 1),
      );
      expect(getConfidenceLevel(cycles)).toBe("medium");
    });

    it("returns high for > 6 cycles", () => {
      const cycles = Array.from({ length: 7 }, (_, i) =>
        makeCycle(`2024-0${i + 1}-01`, 28, i + 1),
      );
      expect(getConfidenceLevel(cycles)).toBe("high");
    });
  });
});
