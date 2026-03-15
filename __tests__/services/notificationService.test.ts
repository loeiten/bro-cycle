import * as Notifications from "expo-notifications";
import {
  requestPermissions,
  schedulePhaseWarnings,
  cancelAllNotifications,
} from "../../src/services/notificationService";
import { Cycle, AppSettings, DEFAULT_SETTINGS } from "../../src/types";

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
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it("returns false when denied", async () => {
      (
        Notifications.requestPermissionsAsync as jest.Mock
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
      // Use a future start date so notifications are in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const startDate = futureDate.toISOString().split("T")[0];
      const cycle = makeCycle(startDate);
      await schedulePhaseWarnings(cycle, DEFAULT_SETTINGS);
      expect(
        Notifications.cancelAllScheduledNotificationsAsync,
      ).toHaveBeenCalled();
    });

    it("schedules notifications for future phases", async () => {
      // Use a date far enough in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const startDate = futureDate.toISOString().split("T")[0];
      const cycle = makeCycle(startDate, 28);
      await schedulePhaseWarnings(cycle, DEFAULT_SETTINGS);
      // Should attempt to schedule luteal and PMS warnings
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  describe("cancelAllNotifications", () => {
    it("cancels all scheduled notifications", async () => {
      await cancelAllNotifications();
      expect(
        Notifications.cancelAllScheduledNotificationsAsync,
      ).toHaveBeenCalled();
    });
  });
});
