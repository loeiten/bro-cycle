import * as SQLite from "expo-sqlite";
import {
  getSetting,
  setSetting,
  getAllSettings,
  saveAllSettings,
} from "../../src/repositories/settingsRepository";
import { resetDatabase } from "../../src/repositories/database";
import { DEFAULT_SETTINGS } from "../../src/types";

const mockGetAllAsync = jest.fn();
const mockGetFirstAsync = jest.fn();
const mockRunAsync = jest.fn();

const mockDb = {
  execAsync: jest.fn().mockResolvedValue(undefined),
  runAsync: mockRunAsync,
  getFirstAsync: mockGetFirstAsync,
  getAllAsync: mockGetAllAsync,
};

describe("settingsRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDatabase();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
    mockGetFirstAsync.mockResolvedValue({ version: 1 });
  });

  describe("getSetting", () => {
    it("returns setting value", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce({ key: "test", value: "42" });
      const result = await getSetting("test");
      expect(result).toBe("42");
    });

    it("returns null for missing setting", async () => {
      mockGetFirstAsync
        .mockResolvedValueOnce({ version: 1 })
        .mockResolvedValueOnce(null);
      const result = await getSetting("missing");
      expect(result).toBeNull();
    });
  });

  describe("setSetting", () => {
    it("upserts a setting", async () => {
      await setSetting("test", "42");
      expect(mockRunAsync).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO settings"),
        ["test", "42"],
      );
    });
  });

  describe("getAllSettings", () => {
    it("returns parsed settings", async () => {
      mockGetAllAsync.mockResolvedValueOnce([
        { key: "default_cycle_length", value: "30" },
        { key: "notifications_enabled", value: "false" },
        { key: "luteal_warning_days_before", value: "3" },
        { key: "pms_warning_days_before", value: "1" },
      ]);
      const result = await getAllSettings();
      expect(result).toEqual({
        default_cycle_length: 30,
        notifications_enabled: false,
        luteal_warning_days_before: 3,
        pms_warning_days_before: 1,
      });
    });

    it("uses defaults for missing settings", async () => {
      mockGetAllAsync.mockResolvedValueOnce([]);
      const result = await getAllSettings();
      expect(result).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("saveAllSettings", () => {
    it("saves all settings", async () => {
      await saveAllSettings(DEFAULT_SETTINGS);
      expect(mockRunAsync).toHaveBeenCalledTimes(4);
    });
  });
});
