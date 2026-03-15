import * as Notifications from "expo-notifications";
import { Cycle, AppSettings, CyclePhase } from "../types";
import { addDaysToDate } from "../utils/dateUtils";
import { getPhaseBoundaries } from "./cycleCalculator";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function schedulePhaseWarnings(
  cycle: Cycle,
  settings: AppSettings,
): Promise<string[]> {
  if (!settings.notifications_enabled) return [];

  // Cancel existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const ids: string[] = [];
  const boundaries = getPhaseBoundaries(cycle.cycle_length);

  // Luteal phase warning
  const lutealStart = boundaries[CyclePhase.Luteal].start;
  const lutealWarningDay = lutealStart - settings.luteal_warning_days_before;
  if (lutealWarningDay > 0) {
    const lutealDate = addDaysToDate(cycle.start_date, lutealWarningDay - 1);
    if (lutealDate > new Date()) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Luteal Phase Approaching",
          body: "The luteal phase starts soon. Mood shifts may begin — be extra supportive!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: lutealDate,
        },
      });
      ids.push(id);
    }
  }

  // PMS phase warning
  const pmsStart = boundaries[CyclePhase.PMS].start;
  const pmsWarningDay = pmsStart - settings.pms_warning_days_before;
  if (pmsWarningDay > 0) {
    const pmsDate = addDaysToDate(cycle.start_date, pmsWarningDay - 1);
    if (pmsDate > new Date()) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "PMS Phase Approaching",
          body: "PMS phase starts soon. Stock up on snacks, be patient, and show extra care!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: pmsDate,
        },
      });
      ids.push(id);
    }
  }

  // Menstrual (period) warning — warns X days before next period
  const nextPeriodDay = cycle.cycle_length + 1;
  const menstrualWarningDay =
    nextPeriodDay - settings.menstrual_warning_days_before;
  if (menstrualWarningDay > 0) {
    const menstrualDate = addDaysToDate(
      cycle.start_date,
      menstrualWarningDay - 1,
    );
    if (menstrualDate > new Date()) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Period Approaching",
          body: "Her period may start soon. Time to be extra thoughtful and prepared!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: menstrualDate,
        },
      });
      ids.push(id);
    }
  }

  return ids;
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
