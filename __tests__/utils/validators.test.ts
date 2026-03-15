import {
  validateMoodScore,
  validateCycleLength,
  validateDateString,
  validateDateNotInFuture,
  validateNotes,
} from "../../src/utils/validators";

describe("validators", () => {
  describe("validateMoodScore", () => {
    it("accepts valid scores 1-5", () => {
      for (let i = 1; i <= 5; i++) {
        expect(validateMoodScore(i)).toBe(true);
      }
    });

    it("rejects 0", () => {
      expect(validateMoodScore(0)).toBe(false);
    });

    it("rejects 6", () => {
      expect(validateMoodScore(6)).toBe(false);
    });

    it("rejects non-integers", () => {
      expect(validateMoodScore(2.5)).toBe(false);
    });

    it("rejects negative numbers", () => {
      expect(validateMoodScore(-1)).toBe(false);
    });
  });

  describe("validateCycleLength", () => {
    it("accepts 21", () => {
      expect(validateCycleLength(21)).toBe(true);
    });

    it("accepts 45", () => {
      expect(validateCycleLength(45)).toBe(true);
    });

    it("accepts 28 (typical)", () => {
      expect(validateCycleLength(28)).toBe(true);
    });

    it("rejects 20", () => {
      expect(validateCycleLength(20)).toBe(false);
    });

    it("rejects 46", () => {
      expect(validateCycleLength(46)).toBe(false);
    });

    it("rejects non-integers", () => {
      expect(validateCycleLength(28.5)).toBe(false);
    });
  });

  describe("validateDateString", () => {
    it("accepts valid ISO date", () => {
      expect(validateDateString("2024-03-15")).toBe(true);
    });

    it("rejects wrong format", () => {
      expect(validateDateString("03/15/2024")).toBe(false);
    });

    it("rejects invalid date", () => {
      expect(validateDateString("2024-13-01")).toBe(false);
    });

    it("rejects empty string", () => {
      expect(validateDateString("")).toBe(false);
    });

    it("rejects partial date", () => {
      expect(validateDateString("2024-03")).toBe(false);
    });
  });

  describe("validateDateNotInFuture", () => {
    it("accepts past date", () => {
      expect(validateDateNotInFuture("2020-01-01")).toBe(true);
    });

    it("accepts today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(validateDateNotInFuture(today)).toBe(true);
    });

    it("rejects future date", () => {
      expect(validateDateNotInFuture("2099-01-01")).toBe(false);
    });

    it("rejects invalid date", () => {
      expect(validateDateNotInFuture("not-a-date")).toBe(false);
    });
  });

  describe("validateNotes", () => {
    it("accepts null", () => {
      expect(validateNotes(null)).toBe(true);
    });

    it("accepts empty string", () => {
      expect(validateNotes("")).toBe(true);
    });

    it("accepts short text", () => {
      expect(validateNotes("Some notes")).toBe(true);
    });

    it("accepts 500 chars", () => {
      expect(validateNotes("a".repeat(500))).toBe(true);
    });

    it("rejects 501 chars", () => {
      expect(validateNotes("a".repeat(501))).toBe(false);
    });
  });
});
