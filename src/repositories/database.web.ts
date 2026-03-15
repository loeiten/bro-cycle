// In-memory database for web platform
// Metro automatically picks this over database.ts when bundling for web

interface Row {
  [key: string]: unknown;
}

interface RunResult {
  lastInsertRowId: number;
  changes: number;
}

class InMemoryDatabase {
  private tables = new Map<string, Row[]>();
  private autoIncrements = new Map<string, number>();

  async execAsync(sql: string): Promise<void> {
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      this.execStatement(stmt);
    }
  }

  private execStatement(sql: string): void {
    // CREATE TABLE - ensure table exists
    const createMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
    if (createMatch) {
      const table = createMatch[1];
      if (!this.tables.has(table)) {
        this.tables.set(table, []);
      }
      return;
    }

    // INSERT OR IGNORE (used by migration defaults)
    const insertIgnoreMatch = sql.match(
      /INSERT OR IGNORE INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i,
    );
    if (insertIgnoreMatch) {
      const [, table, colStr, valStr] = insertIgnoreMatch;
      const cols = colStr.split(",").map((c) => c.trim());
      const vals = valStr
        .split(",")
        .map((v) => v.trim().replace(/^'|'$/g, ""));
      const rows = this.tables.get(table) || [];
      if (!rows.some((r) => r[cols[0]] === vals[0])) {
        const row: Row = {};
        cols.forEach((col, i) => {
          row[col] = vals[i];
        });
        rows.push(row);
      }
      return;
    }

    // Regular INSERT (used by migration for schema_version with ? params not here)
    const insertMatch = sql.match(
      /INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i,
    );
    if (insertMatch) {
      const [, table, colStr, valStr] = insertMatch;
      const cols = colStr.split(",").map((c) => c.trim());
      const vals = valStr
        .split(",")
        .map((v) => v.trim().replace(/^'|'$/g, ""));
      const rows = this.tables.get(table) || [];
      const row: Row = {};
      cols.forEach((col, i) => {
        row[col] = vals[i];
      });
      rows.push(row);
      return;
    }
  }

  async runAsync(sql: string, params?: unknown[]): Promise<RunResult> {
    const p = params || [];

    // INSERT ... ON CONFLICT ... DO UPDATE
    const upsertMatch = sql.match(
      /INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\([^)]+\)\s*ON CONFLICT\((\w+)\)\s*DO UPDATE SET/i,
    );
    if (upsertMatch) {
      const [, table, colStr, conflictCol] = upsertMatch;
      const cols = colStr.split(",").map((c) => c.trim());
      const rows = this.tables.get(table) || [];
      const conflictIdx = cols.indexOf(conflictCol);
      const existingIdx = rows.findIndex(
        (r) => r[conflictCol] === p[conflictIdx],
      );

      if (existingIdx >= 0) {
        cols.forEach((col, i) => {
          if (p[i] !== undefined) rows[existingIdx][col] = p[i];
        });
        return {
          lastInsertRowId: (rows[existingIdx].id as number) ?? 0,
          changes: 1,
        };
      } else {
        const hasAutoId = table !== "settings";
        const id = hasAutoId
          ? (this.autoIncrements.get(table) ?? 0) + 1
          : undefined;
        if (hasAutoId) this.autoIncrements.set(table, id!);
        const row: Row = {};
        if (hasAutoId) row.id = id;
        cols.forEach((col, i) => {
          row[col] = p[i] ?? null;
        });
        row.created_at = new Date().toISOString().replace("T", " ").slice(0, 19);
        rows.push(row);
        this.tables.set(table, rows);
        return { lastInsertRowId: id ?? 0, changes: 1 };
      }
    }

    // Regular INSERT
    const insertMatch = sql.match(
      /INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES/i,
    );
    if (insertMatch) {
      const [, table, colStr] = insertMatch;
      const cols = colStr.split(",").map((c) => c.trim());
      const rows = this.tables.get(table) || [];
      const hasAutoId = table !== "settings" && table !== "schema_version";
      const id = hasAutoId
        ? (this.autoIncrements.get(table) ?? 0) + 1
        : undefined;
      if (hasAutoId) this.autoIncrements.set(table, id!);
      const row: Row = {};
      if (hasAutoId) row.id = id;
      cols.forEach((col, i) => {
        row[col] = p[i] ?? null;
      });
      row.created_at = new Date().toISOString().replace("T", " ").slice(0, 19);
      rows.push(row);
      this.tables.set(table, rows);
      return { lastInsertRowId: id ?? 0, changes: 1 };
    }

    // UPDATE table SET col = ? WHERE col = ?
    const updateMatch = sql.match(
      /UPDATE (\w+)\s+SET\s+(\w+)\s*=\s*\?\s+WHERE\s+(\w+)\s*=\s*\?/i,
    );
    if (updateMatch) {
      const [, table, setCol, whereCol] = updateMatch;
      const rows = this.tables.get(table) || [];
      let changes = 0;
      for (const row of rows) {
        if (String(row[whereCol]) === String(p[1])) {
          row[setCol] = p[0];
          changes++;
        }
      }
      return { lastInsertRowId: 0, changes };
    }

    // DELETE FROM table WHERE col = ?
    const deleteMatch = sql.match(
      /DELETE FROM (\w+)\s+WHERE\s+(\w+)\s*=\s*\?/i,
    );
    if (deleteMatch) {
      const [, table, whereCol] = deleteMatch;
      const rows = this.tables.get(table) || [];
      const before = rows.length;
      this.tables.set(
        table,
        rows.filter((r) => String(r[whereCol]) !== String(p[0])),
      );
      return {
        lastInsertRowId: 0,
        changes: before - (this.tables.get(table)?.length ?? 0),
      };
    }

    return { lastInsertRowId: 0, changes: 0 };
  }

  async getAllAsync<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const p = params || [];

    // Extract table name
    const fromMatch = sql.match(/FROM (\w+)/i);
    if (!fromMatch) return [];
    const table = fromMatch[1];
    let rows = [...(this.tables.get(table) || [])];

    // Apply WHERE clauses
    // col >= ? AND col <= ?
    const rangeMatch = sql.match(/(\w+)\s*>=\s*\?\s*AND\s*\w+\s*<=\s*\?/i);
    if (rangeMatch) {
      const col = rangeMatch[1];
      rows = rows.filter((r) => r[col] >= p[0] && r[col] <= p[1]);
    }
    // col = ?
    else {
      const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        rows = rows.filter(
          (r) => String(r[whereMatch[1]]) === String(p[0]),
        );
      }
    }

    // ORDER BY
    const orderMatch = sql.match(/ORDER BY\s+(\w+)\s+(ASC|DESC)/i);
    if (orderMatch) {
      const [, col, dir] = orderMatch;
      const desc = dir.toUpperCase() === "DESC";
      rows.sort((a, b) => {
        const av = String(a[col] ?? "");
        const bv = String(b[col] ?? "");
        return desc ? bv.localeCompare(av) : av.localeCompare(bv);
      });
    }

    // LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1], 10));
    }

    return rows as T[];
  }

  async getFirstAsync<T>(sql: string, params?: unknown[]): Promise<T | null> {
    // SELECT MAX(col) as alias FROM table
    const maxMatch = sql.match(/SELECT MAX\((\w+)\) as (\w+) FROM (\w+)/i);
    if (maxMatch) {
      const [, col, alias, table] = maxMatch;
      const rows = this.tables.get(table) || [];
      if (rows.length === 0) return { [alias]: null } as T;
      const max = Math.max(...rows.map((r) => Number(r[col]) || 0));
      return { [alias]: max } as T;
    }

    // SELECT COUNT(*) as alias FROM table
    const countMatch = sql.match(/SELECT COUNT\(\*\) as (\w+) FROM (\w+)/i);
    if (countMatch) {
      const [, alias, table] = countMatch;
      return { [alias]: (this.tables.get(table) || []).length } as T;
    }

    const all = await this.getAllAsync<T>(sql, params);
    return all[0] ?? null;
  }
}

let db: InMemoryDatabase | null = null;

export async function getDatabase(): Promise<InMemoryDatabase> {
  if (db) return db;
  db = new InMemoryDatabase();
  await runMigrations(db);
  return db;
}

async function runMigrations(database: InMemoryDatabase): Promise<void> {
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

async function getCurrentVersion(database: InMemoryDatabase): Promise<number> {
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
      CREATE TABLE IF NOT EXISTS cycles;
      CREATE TABLE IF NOT EXISTS mood_logs;
      CREATE TABLE IF NOT EXISTS settings;
      INSERT OR IGNORE INTO settings (key, value) VALUES ('default_cycle_length', '28');
      INSERT OR IGNORE INTO settings (key, value) VALUES ('notifications_enabled', 'true');
      INSERT OR IGNORE INTO settings (key, value) VALUES ('luteal_warning_days_before', '2');
      INSERT OR IGNORE INTO settings (key, value) VALUES ('pms_warning_days_before', '2')
    `,
  },
];

export function resetDatabase(): void {
  db = null;
}
