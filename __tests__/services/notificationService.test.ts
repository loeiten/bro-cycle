import {
  requestPermissions,
  schedulePhaseWarnings,
  cancelAllNotifications,
} from "../../src/services/notificationService";
import { Cycle, AppSettings, DEFAULT_SETTINGS } from "../../src/types";

// Access the mocked module (mocked in jest.setup.ts)
const mockNotifications =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("expo-notifications") as typeof import("expo-notifications");

const makeCycle = (startDate: string, cycleLength = 28): Cycle => ({
  id: 1,
  start_date: startDate,
  cycle_length: cycleLength,
  notes: null,
  created_at: "2024-01-01T00:00:00",
});

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requestPermissions", () => {
    it("returns true when granted", async () => {
      const result = await requestPermissions();
      expect(result).toBe(true);
      expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it("returns false when denied", async () => {
      (
        mockNotifications.requestPermissionsAsync as jest.Mock
      ).mockResolvedValueOnce({ status: "denied" });
      const result = await requestPermissions();
      expect(result).toBe(false);
    });
  });

  describe("schedulePhaseWarnings", () => {
    it("returns empty array when notifications disabled", async () => {
      const settings: AppSettings = {
        ...DEFAULT_SETTINGS,
        notifications_enabled: false,
      };
      const cycle = makeCycle("2024-03-01");
      const ids = await schedulePhaseWarnings(cycle, settings);
      expect(ids).toEqual([]);
    });

    it("cancels existing notifications first", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const startDate = futureDate.toISOString().split("T")[0];
      const cycle = makeCycle(startDate);
      await schedulePhaseWarnings(cycle, DEFAULT_SETTINGS);
      expect(
        mockNotifications.cancelAllScheduledNotificationsAsync,
      ).toHaveBeenCalled();
    });

    it("schedules notifications for future phases", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const startDate = futureDate.toISOString().split("T")[0];
      const cycle = makeCycle(startDate, 28);
      await schedulePhaseWarnings(cycle, DEFAULT_SETTINGS);
      expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  describe("cancelAllNotifications", () => {
    it("cancels all scheduled notifications", async () => {
      await cancelAllNotifications();
      expect(
        mockNotifications.cancelAllScheduledNotificationsAsync,
      ).toHaveBeenCalled();
    });
  });
});
