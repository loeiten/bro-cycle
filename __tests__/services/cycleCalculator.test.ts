import {
  getPhaseForDay,
  getPhaseBoundaries,
  getCurrentPhaseInfo,
  getExpectedPeriodDate,
  getDaysUntilPhase,
} from "../../src/services/cycleCalculator";
import { CyclePhase, Cycle } from "../../src/types";

const makeCycle = (startDate: string, cycleLength = 28, id = 1): Cycle => ({
  id,
  start_date: startDate,
  cycle_length: cycleLength,
  notes: null,
  created_at: "2024-01-01T00:00:00",
});

describe("cycleCalculator", () => {
  describe("getPhaseForDay", () => {
    // For cycle length 28: menstrual 1-7, follicular 8-14, luteal 15-21, PMS 22-28
    it("returns Menstrual for day 1", () => {
      expect(getPhaseForDay(1, 28)).toBe(CyclePhase.Menstrual);
    });

    it("returns Menstrual for day 7", () => {
      expect(getPhaseForDay(7, 28)).toBe(CyclePhase.Menstrual);
    });

    it("returns Follicular for day 8", () => {
      expect(getPhaseForDay(8, 28)).toBe(CyclePhase.Follicular);
    });

    it("returns Follicular for day 14", () => {
      expect(getPhaseForDay(14, 28)).toBe(CyclePhase.Follicular);
    });

    it("returns Luteal for day 15", () => {
      expect(getPhaseForDay(15, 28)).toBe(CyclePhase.Luteal);
    });

    it("returns Luteal for day 21", () => {
      expect(getPhaseForDay(21, 28)).toBe(CyclePhase.Luteal);
    });

    it("returns PMS for day 22", () => {
      expect(getPhaseForDay(22, 28)).toBe(CyclePhase.PMS);
    });

    it("returns PMS for day 28", () => {
      expect(getPhaseForDay(28, 28)).toBe(CyclePhase.PMS);
    });

    it("works for short cycle (21 days)", () => {
      // floor(21/4)=5, floor(21/2)=10, floor(63/4)=15
      expect(getPhaseForDay(1, 21)).toBe(CyclePhase.Menstrual);
      expect(getPhaseForDay(5, 21)).toBe(CyclePhase.Menstrual);
      expect(getPhaseForDay(6, 21)).toBe(CyclePhase.Follicular);
      expect(getPhaseForDay(10, 21)).toBe(CyclePhase.Follicular);
      expect(getPhaseForDay(11, 21)).toBe(CyclePhase.Luteal);
      expect(getPhaseForDay(15, 21)).toBe(CyclePhase.Luteal);
      expect(getPhaseForDay(16, 21)).toBe(CyclePhase.PMS);
      expect(getPhaseForDay(21, 21)).toBe(CyclePhase.PMS);
    });
  });

  describe("getPhaseBoundaries", () => {
    it("returns correct boundaries for 28-day cycle", () => {
      const boundaries = getPhaseBoundaries(28);
      expect(boundaries[CyclePhase.Menstrual]).toEqual({
        start: 1,
        end: 7,
      });
      expect(boundaries[CyclePhase.Follicular]).toEqual({
        start: 8,
        end: 14,
      });
      expect(boundaries[CyclePhase.Luteal]).toEqual({
        start: 15,
        end: 21,
      });
      expect(boundaries[CyclePhase.PMS]).toEqual({
        start: 22,
        end: 28,
      });
    });
  });

  describe("getCurrentPhaseInfo", () => {
    it("returns correct info on day 1", () => {
      const cycle = makeCycle("2024-03-15");
      const info = getCurrentPhaseInfo(cycle, "2024-03-15");
      expect(info.phase).toBe(CyclePhase.Menstrual);
      expect(info.dayInCycle).toBe(1);
      expect(info.dayInPhase).toBe(1);
      expect(info.isOverdue).toBe(false);
    });

    it("returns correct info mid-cycle", () => {
      const cycle = makeCycle("2024-03-01");
      const info = getCurrentPhaseInfo(cycle, "2024-03-15");
      expect(info.phase).toBe(CyclePhase.Luteal);
      expect(info.dayInCycle).toBe(15);
    });

    it("detects overdue cycle", () => {
      const cycle = makeCycle("2024-03-01");
      const info = getCurrentPhaseInfo(cycle, "2024-04-05"); // Day 36
      expect(info.isOverdue).toBe(true);
      expect(info.dayInCycle).toBe(36);
      // Phase should reflect the last phase
      expect(info.phase).toBe(CyclePhase.PMS);
    });
  });

  describe("getExpectedPeriodDate", () => {
    it("returns correct expected date", () => {
      const cycle = makeCycle("2024-03-01");
      expect(getExpectedPeriodDate(cycle)).toBe("2024-03-29");
    });
  });

  describe("getDaysUntilPhase", () => {
    it("returns days until luteal from day 1", () => {
      const cycle = makeCycle("2024-03-01");
      const days = getDaysUntilPhase(cycle, CyclePhase.Luteal, "2024-03-01");
      expect(days).toBe(14);
    });

    it("returns null if already in or past the phase", () => {
      const cycle = makeCycle("2024-03-01");
      const days = getDaysUntilPhase(cycle, CyclePhase.Menstrual, "2024-03-05");
      expect(days).toBeNull();
    });

    it("returns days until PMS", () => {
      const cycle = makeCycle("2024-03-01");
      const days = getDaysUntilPhase(cycle, CyclePhase.PMS, "2024-03-01");
      expect(days).toBe(21);
    });
  });
});
