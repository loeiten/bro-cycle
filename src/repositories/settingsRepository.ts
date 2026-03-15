import { AppSettings, DEFAULT_SETTINGS, Setting } from "../types";
import { getDatabase } from "./database";

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Setting>(
    "SELECT * FROM settings WHERE key = ?",
    [key],
  );
  return result?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  );
}

export async function getAllSettings(): Promise<AppSettings> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Setting>("SELECT * FROM settings");

  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    default_cycle_length: parseInt(
      map.get("default_cycle_length") ??
        String(DEFAULT_SETTINGS.default_cycle_length),
      10,
    ),
    notifications_enabled:
      (map.get("notifications_enabled") ?? "true") === "true",
    luteal_warning_days_before: parseInt(
      map.get("luteal_warning_days_before") ??
        String(DEFAULT_SETTINGS.luteal_warning_days_before),
      10,
    ),
    pms_warning_days_before: parseInt(
      map.get("pms_warning_days_before") ??
        String(DEFAULT_SETTINGS.pms_warning_days_before),
      10,
    ),
  };
}

export async function saveAllSettings(settings: AppSettings): Promise<void> {
  await setSetting(
    "default_cycle_length",
    String(settings.default_cycle_length),
  );
  await setSetting(
    "notifications_enabled",
    String(settings.notifications_enabled),
  );
  await setSetting(
    "luteal_warning_days_before",
    String(settings.luteal_warning_days_before),
  );
  await setSetting(
    "pms_warning_days_before",
    String(settings.pms_warning_days_before),
  );
}
