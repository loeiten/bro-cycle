import Constants from "expo-constants";
import { Cycle, AppSettings, CyclePhase } from "../types";
import { addDaysToDate } from "../utils/dateUtils";
import { getPhaseBoundaries } from "./cycleCalculator";

const isExpoGo =
  Constants.executionEnvironment === "storeClient" ||
  Constants.appOwnership === "expo";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Notifications: typeof import("expo-notifications") | null = isExpoGo
  ? null
  : require("expo-notifications");

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function requestPermissions(): Promise<boolean> {
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

const PHASE_CONFIG: {
  phase: CyclePhase;
  label: string;
  emoji: string;
  settingsKey: keyof AppSettings;
}[] = [
  {
    phase: CyclePhase.Follicular,
    label: "Follicular phase",
    emoji: "\uD83D\uDE0A",
    settingsKey: "follicular_warning_days_before",
  },
  {
    phase: CyclePhase.Luteal,
    label: "Luteal phase",
    emoji: "\uD83D\uDE22",
    settingsKey: "luteal_warning_days_before",
  },
  {
    phase: CyclePhase.PMS,
    label: "PMS phase",
    emoji: "\u26C8\uFE0F",
    settingsKey: "pms_warning_days_before",
  },
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function schedulePhaseWarnings(
  cycle: Cycle,
  settings: AppSettings,
): Promise<string[]> {
  if (!Notifications || !settings.notifications_enabled) return [];

  try {
    const granted = await requestPermissions();
    if (!granted) return [];

    await Notifications.cancelAllScheduledNotificationsAsync();

    const ids: string[] = [];
    const now = new Date();
    const boundaries = getPhaseBoundaries(cycle.cycle_length);

    // Schedule warnings for each phase
    for (const config of PHASE_CONFIG) {
      const phaseStart = boundaries[config.phase].start;
      const warningDays = settings[config.settingsKey] as number;

      for (let daysUntil = warningDays; daysUntil >= 1; daysUntil--) {
        const notifCycleDay = phaseStart - daysUntil;
        if (notifCycleDay < 1) continue;

        const notifDate = addDaysToDate(cycle.start_date, notifCycleDay - 1);
        const label = daysUntil === 1 ? "1 day" : `${daysUntil} days`;
        const title = `${config.emoji} ${label} until the ${config.label}`;

        const id = await scheduleForDate(Notifications, notifDate, now, title);
        if (id) ids.push(id);
      }
    }

    // Menstrual (next period) warnings
    const nextPeriodDay = cycle.cycle_length + 1;
    const menstrualWarningDays = settings.menstrual_warning_days_before;

    for (let daysUntil = menstrualWarningDays; daysUntil >= 1; daysUntil--) {
      const notifCycleDay = nextPeriodDay - daysUntil;
      if (notifCycleDay < 1) continue;

      const notifDate = addDaysToDate(cycle.start_date, notifCycleDay - 1);
      const label = daysUntil === 1 ? "1 day" : `${daysUntil} days`;
      const title = `\uD83E\uDE78 ${label} until the Period`;

      const id = await scheduleForDate(Notifications, notifDate, now, title);
      if (id) ids.push(id);
    }

    return ids;
  } catch {
    return [];
  }
}

async function scheduleForDate(
  Notifications: NonNullable<typeof import("expo-notifications")>,
  notifDate: Date,
  now: Date,
  title: string,
): Promise<string | null> {
  // Set target time to 07:30
  const at0730 = new Date(notifDate);
  at0730.setHours(7, 30, 0, 0);

  if (at0730 > now) {
    // Future: schedule at 07:30
    return Notifications.scheduleNotificationAsync({
      content: { title, body: "" },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at0730,
      },
    });
  } else if (isSameDay(notifDate, now)) {
    // Today but past 07:30: fire in 2 seconds
    return Notifications.scheduleNotificationAsync({
      content: { title, body: "" },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }

  // Past day: skip
  return null;
}

export async function cancelAllNotifications(): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Notifications not available
  }
}
