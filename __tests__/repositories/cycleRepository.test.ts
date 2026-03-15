import * as SQLite from "expo-sqlite";
import {
  getAllCycles,
  getLatestCycle,
  getCycleById,
  insertCycle,
  deleteCycle,
  getCycleCount,
} from "../../src/repositories/cycleRepository";
import { resetDatabase } from "../../src/repositories/database";
import { Cycle } from "../../src/types";

const mockCycle: Cycle = {
  id: 1,
  start_date: "2024-03-01",
  cycle_length: 28,
  notes: null,
  created_at: "2024-03-01T00:00:00",
};

const mockGetAllAsync = jest.fn();
const mockGetFirstAsync = jest.fn();
const mockRunAsync = jest.fn();

const mockDb = {
  execAsync: jest.fn().mockResolvedValue(undefined),
  runAsync: mockRunAsync,
  getFirstAsync: mockGetFirstAsync,
  getAllAsync: mockGetAllAsync,
};

describe("cycleRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDatabase();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
    // Mock schema_version check (return version 1 to skip migrations)
    mockGetFirstAsync.mockResolvedValue({ version: 1 });
  });

  describe("getAllCycles", () => {
    it("returns all cycles ordered by start_date DESC", async () => {
      mockGetAllAsync.mockResolvedValueOnce([mockCycle]);
      const result = await getAllCycles();
      expect(result).toEqual([mockCycle]);
      expect(mockGetAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM cycles ORDER BY start_date DESC",
      );
    });
  });

  describe("getLatestCycle", () => {
    it("returns the most recent cycle", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 }) // schema check
        .mockResolvedValueOnce(mockCycle);
      const result = await getLatestCycle();
      expect(result).toEqual(mockCycle);
    });
  });

  describe("getCycleById", () => {
    it("returns cycle by ID", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce(mockCycle);
      const result = await getCycleById(1);
      expect(result).toEqual(mockCycle);
    });
  });

  describe("insertCycle", () => {
    it("inserts a new cycle", async () => {
      mockRunAsync.mockResolvedValue({ lastInsertRowId: 2 });
      mockGetAllAsync.mockResolvedValueOnce([]); // no settings
      mockGetAllAsync.mockResolvedValueOnce([mockCycle]); // getAllCycles
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 }) // schema check
        .mockResolvedValueOnce(mockCycle); // getCycleById
      await insertCycle("2024-03-01", 28);
      expect(mockRunAsync).toHaveBeenCalledWith(
        "INSERT INTO cycles (start_date, cycle_length, notes) VALUES (?, ?, ?)",
        ["2024-03-01", 28, null],
      );
    });
  });

  describe("deleteCycle", () => {
    it("deletes a cycle by ID", async () => {
      await deleteCycle(1);
      expect(mockRunAsync).toHaveBeenCalledWith(
        "DELETE FROM cycles WHERE id = ?",
        [1],
      );
    });
  });

  describe("getCycleCount", () => {
    it("returns count of cycles", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce({ count: 5 });
      const result = await getCycleCount();
      expect(result).toBe(5);
    });

    it("returns 0 when no result", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce(null);
      const result = await getCycleCount();
      expect(result).toBe(0);
    });
  });
});
