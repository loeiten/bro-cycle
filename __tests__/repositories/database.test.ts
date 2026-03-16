import * as SQLite from "expo-sqlite";
import { getDatabase, resetDatabase } from "../../src/repositories/database";

const mockExecAsync = jest.fn().mockResolvedValue(undefined);
const mockRunAsync = jest.fn().mockResolvedValue({ lastInsertRowId: 1 });
const mockGetFirstAsync = jest.fn().mockResolvedValue({ version: 0 });

const mockDb = {
  execAsync: mockExecAsync,
  runAsync: mockRunAsync,
  getFirstAsync: mockGetFirstAsync,
  getAllAsync: jest.fn().mockResolvedValue([]),
};

describe("database", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDatabase();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
  });

  it("opens database and runs migrations", async () => {
    const db = await getDatabase();
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("brocycle.db");
    expect(db).toBe(mockDb);
    // Should create schema_version table
    expect(mockExecAsync).toHaveBeenCalled();
  });

  it("returns cached database on second call", async () => {
    const db1 = await getDatabase();
    const db2 = await getDatabase();
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
    expect(db1).toBe(db2);
  });

  it("runs migration version 1 and 2 when at version 0", async () => {
    mockGetFirstAsync.mockResolvedValueOnce({ version: 0 });
    await getDatabase();
    // Should have called execAsync for schema_version + migration 1 + migration 2 + migration 3
    expect(mockExecAsync).toHaveBeenCalledTimes(4);
    // Should have inserted version records
    expect(mockRunAsync).toHaveBeenCalledWith(
      "INSERT INTO schema_version (version) VALUES (?)",
      [1],
    );
    expect(mockRunAsync).toHaveBeenCalledWith(
      "INSERT INTO schema_version (version) VALUES (?)",
      [2],
    );
    expect(mockRunAsync).toHaveBeenCalledWith(
      "INSERT INTO schema_version (version) VALUES (?)",
      [3],
    );
  });

  it("skips migrations when already at latest version", async () => {
    mockGetFirstAsync.mockResolvedValueOnce({ version: 3 });
    await getDatabase();
    // Only schema_version table creation, no migration
    expect(mockExecAsync).toHaveBeenCalledTimes(1);
    expect(mockRunAsync).not.toHaveBeenCalled();
  });
});
