import { MoodLog } from "../types";
import { getDatabase } from "./database";

export async function getAllMoodLogs(): Promise<MoodLog[]> {
  const db = await getDatabase();
  return db.getAllAsync<MoodLog>("SELECT * FROM mood_logs ORDER BY date DESC");
}

export async function getMoodLogByDate(date: string): Promise<MoodLog | null> {
  const db = await getDatabase();
  return db.getFirstAsync<MoodLog>("SELECT * FROM mood_logs WHERE date = ?", [
    date,
  ]);
}

export async function getMoodLogsForDateRange(
  startDate: string,
  endDate: string,
): Promise<MoodLog[]> {
  const db = await getDatabase();
  return db.getAllAsync<MoodLog>(
    "SELECT * FROM mood_logs WHERE date >= ? AND date <= ? ORDER BY date ASC",
    [startDate, endDate],
  );
}

export async function upsertMoodLog(
  date: string,
  moodScore: number,
  notes?: string,
): Promise<MoodLog> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO mood_logs (date, mood_score, notes)
     VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       mood_score = excluded.mood_score,
       notes = excluded.notes`,
    [date, moodScore, notes ?? null],
  );
  return (await getMoodLogByDate(date))!;
}

export async function deleteMoodLog(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM mood_logs WHERE id = ?", [id]);
}
