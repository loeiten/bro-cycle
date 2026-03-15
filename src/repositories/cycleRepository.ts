import { Cycle } from "../types";
import { getDatabase } from "./database";

export async function getAllCycles(): Promise<Cycle[]> {
  const db = await getDatabase();
  return db.getAllAsync<Cycle>("SELECT * FROM cycles ORDER BY start_date DESC");
}

export async function getLatestCycle(): Promise<Cycle | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Cycle>(
    "SELECT * FROM cycles ORDER BY start_date DESC LIMIT 1",
  );
}

export async function getCycleById(id: number): Promise<Cycle | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Cycle>("SELECT * FROM cycles WHERE id = ?", [id]);
}

export async function insertCycle(
  startDate: string,
  cycleLength: number,
  notes?: string,
): Promise<Cycle> {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO cycles (start_date, cycle_length, notes) VALUES (?, ?, ?)",
    [startDate, cycleLength, notes ?? null],
  );

  // Update the previous cycle's length based on actual dates
  const allCycles = await getAllCycles();
  if (allCycles.length >= 2) {
    const current = allCycles[0]; // newest
    const previous = allCycles[1]; // second newest
    const daysBetween = Math.round(
      (new Date(current.start_date).getTime() -
        new Date(previous.start_date).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysBetween > 0 && daysBetween <= 45) {
      await db.runAsync("UPDATE cycles SET cycle_length = ? WHERE id = ?", [
        daysBetween,
        previous.id,
      ]);
    }
  }

  return (await getCycleById(result.lastInsertRowId))!;
}

export async function deleteCycle(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM cycles WHERE id = ?", [id]);
}

export async function getCycleCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM cycles",
  );
  return result?.count ?? 0;
}
