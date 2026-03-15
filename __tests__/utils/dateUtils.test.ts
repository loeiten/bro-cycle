import {
  formatDate,
  formatDateShort,
  toISODate,
  daysBetween,
  addDaysToDate,
  isValidDate,
  todayISO,
  getCycleDay,
} from "../../src/utils/dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("formats ISO string to readable date", () => {
      expect(formatDate("2024-03-15")).toBe("Mar 15, 2024");
    });

    it("formats Date object", () => {
      expect(formatDate(new Date(2024, 0, 1))).toBe("Jan 1, 2024");
    });
  });

  describe("formatDateShort", () => {
    it("formats to short date", () => {
      expect(formatDateShort("2024-03-15")).toBe("Mar 15");
    });

    it("formats Date object", () => {
      expect(formatDateShort(new Date(2024, 11, 25))).toBe("Dec 25");
    });
  });

  describe("toISODate", () => {
    it("converts Date to ISO string", () => {
      expect(toISODate(new Date(2024, 2, 15))).toBe("2024-03-15");
    });
  });

  describe("daysBetween", () => {
    it("calculates days between two ISO strings", () => {
      expect(daysBetween("2024-03-01", "2024-03-15")).toBe(14);
    });

    it("calculates days between Date objects", () => {
      expect(daysBetween(new Date(2024, 2, 1), new Date(2024, 2, 15))).toBe(14);
    });

    it("returns 0 for same day", () => {
      expect(daysBetween("2024-03-15", "2024-03-15")).toBe(0);
    });

    it("returns negative for reversed dates", () => {
      expect(daysBetween("2024-03-15", "2024-03-01")).toBe(-14);
    });
  });

  describe("addDaysToDate", () => {
    it("adds days to ISO string", () => {
      const result = addDaysToDate("2024-03-01", 14);
      expect(toISODate(result)).toBe("2024-03-15");
    });

    it("adds days to Date object", () => {
      const result = addDaysToDate(new Date(2024, 2, 1), 5);
      expect(toISODate(result)).toBe("2024-03-06");
    });
  });

  describe("isValidDate", () => {
    it("returns true for valid date", () => {
      expect(isValidDate("2024-03-15")).toBe(true);
    });

    it("returns false for invalid date", () => {
      expect(isValidDate("not-a-date")).toBe(false);
    });
  });

  describe("todayISO", () => {
    it("returns today in ISO format", () => {
      const result = todayISO();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getCycleDay", () => {
    it("returns 1 for start date", () => {
      expect(getCycleDay("2024-03-15", "2024-03-15")).toBe(1);
    });

    it("returns correct day count", () => {
      expect(getCycleDay("2024-03-01", "2024-03-15")).toBe(15);
    });
  });
});
