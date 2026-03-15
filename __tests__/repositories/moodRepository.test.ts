import * as SQLite from "expo-sqlite";
import {
  getAllMoodLogs,
  getMoodLogByDate,
  getMoodLogsForDateRange,
  upsertMoodLog,
  deleteMoodLog,
} from "../../src/repositories/moodRepository";
import { resetDatabase } from "../../src/repositories/database";
import { MoodLog } from "../../src/types";

const mockMood: MoodLog = {
  id: 1,
  date: "2024-03-15",
  mood_score: 3,
  notes: null,
  created_at: "2024-03-15T00:00:00",
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

describe("moodRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDatabase();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
    mockGetFirstAsync.mockResolvedValue({ version: 1 });
  });

  describe("getAllMoodLogs", () => {
    it("returns all mood logs", async () => {
      mockGetAllAsync.mockResolvedValueOnce([mockMood]);
      const result = await getAllMoodLogs();
      expect(result).toEqual([mockMood]);
    });
  });

  describe("getMoodLogByDate", () => {
    it("returns mood log for date", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce(mockMood);
      const result = await getMoodLogByDate("2024-03-15");
      expect(result).toEqual(mockMood);
    });
  });

  describe("getMoodLogsForDateRange", () => {
    it("returns mood logs in range", async () => {
      mockGetAllAsync.mockResolvedValueOnce([mockMood]);
      const result = await getMoodLogsForDateRange("2024-03-01", "2024-03-31");
      expect(result).toEqual([mockMood]);
      expect(mockGetAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM mood_logs WHERE date >= ? AND date <= ? ORDER BY date ASC",
        ["2024-03-01", "2024-03-31"],
      );
    });
  });

  describe("upsertMoodLog", () => {
    it("inserts or updates mood log", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce(mockMood);
      await upsertMoodLog("2024-03-15", 3);
      expect(mockRunAsync).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO mood_logs"),
        ["2024-03-15", 3, null],
      );
    });
  });

  describe("deleteMoodLog", () => {
    it("deletes a mood log", async () => {
      await deleteMoodLog(1);
      expect(mockRunAsync).toHaveBeenCalledWith(
        "DELETE FROM mood_logs WHERE id = ?",
        [1],
      );
    });
  });
});
