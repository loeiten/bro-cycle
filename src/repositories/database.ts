import * as SQLite from "expo-sqlite";

const DB_NAME = "brocycle.db";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  // Create schema_version table first
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const currentVersion = await getCurrentVersion(database);

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      await database.execAsync(migration.sql);
      await database.runAsync(
        "INSERT INTO schema_version (version) VALUES (?)",
        [migration.version],
      );
    }
  }
}

async function getCurrentVersion(
  database: SQLite.SQLiteDatabase,
): Promise<number> {
  const result = await database.getFirstAsync<{ version: number }>(
    "SELECT MAX(version) as version FROM schema_version",
  );
  return result?.version ?? 0;
}

interface Migration {
  version: number;
  sql: string;
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_date TEXT NOT NULL UNIQUE,
        cycle_length INTEGER NOT NULL DEFAULT 28,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS mood_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        mood_score INTEGER NOT NULL CHECK(mood_score >= 1 AND mood_score <= 5),
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      INSERT OR IGNORE INTO settings (key, value) VALUES ('default_cycle_length', '28');
      INSERT OR IGNORE INTO settings (key, value) VALUES ('notifications_enabled', 'true');
      INSERT OR IGNORE INTO settings (key, value) VALUES ('luteal_warning_days_before', '2');
      INSERT OR IGNORE INTO settings (key, value) VALUES ('pms_warning_days_before', '2');
    `,
  },
];

// For testing: reset the singleton
export function resetDatabase(): void {
  db = null;
}
