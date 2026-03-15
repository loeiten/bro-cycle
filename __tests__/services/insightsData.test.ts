import { INSIGHTS, getInsightsForPhase } from "../../src/services/insightsData";
import { CyclePhase } from "../../src/types";

describe("insightsData", () => {
  describe("INSIGHTS", () => {
    it("has 4 categories", () => {
      expect(INSIGHTS).toHaveLength(4);
    });

    it("has unique category IDs", () => {
      const ids = INSIGHTS.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has unique item IDs across all categories", () => {
      const allIds = INSIGHTS.flatMap((c) => c.items.map((i) => i.id));
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    it("every item has non-empty title and content", () => {
      for (const category of INSIGHTS) {
        for (const item of category.items) {
          expect(item.title.length).toBeGreaterThan(0);
          expect(item.content.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("getInsightsForPhase", () => {
    it("returns insights relevant to Menstrual phase", () => {
      const result = getInsightsForPhase(CyclePhase.Menstrual);
      expect(result.length).toBeGreaterThan(0);
      for (const category of result) {
        for (const item of category.items) {
          expect(!item.phase || item.phase === CyclePhase.Menstrual).toBe(true);
        }
      }
    });

    it("returns insights relevant to Follicular phase", () => {
      const result = getInsightsForPhase(CyclePhase.Follicular);
      expect(result.length).toBeGreaterThan(0);
    });

    it("filters out categories with no matching items", () => {
      // All categories should have at least general items (no phase)
      const result = getInsightsForPhase(CyclePhase.PMS);
      for (const category of result) {
        expect(category.items.length).toBeGreaterThan(0);
      }
    });
  });
});
