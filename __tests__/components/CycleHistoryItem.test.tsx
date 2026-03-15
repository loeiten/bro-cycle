import React from "react";
import { render, screen } from "@testing-library/react-native";
import { CycleHistoryItem } from "../../src/components/CycleHistoryItem";
import { Cycle, MoodTrend } from "../../src/types";

const mockCycle: Cycle = {
  id: 1,
  start_date: "2024-03-01",
  cycle_length: 28,
  notes: "Test notes",
  created_at: "2024-03-01T00:00:00",
};

describe("CycleHistoryItem", () => {
  it("renders cycle date", () => {
    render(<CycleHistoryItem cycle={mockCycle} />);
    expect(screen.getByText("Mar 1, 2024")).toBeTruthy();
  });

  it("renders cycle length", () => {
    render(<CycleHistoryItem cycle={mockCycle} />);
    expect(screen.getByText("28 days")).toBeTruthy();
  });

  it("renders notes", () => {
    render(<CycleHistoryItem cycle={mockCycle} />);
    expect(screen.getByText("Test notes")).toBeTruthy();
  });

  it("renders mood trend when provided", () => {
    const trend: MoodTrend[] = [
      { cycleDay: 1, moodScore: 3, date: "2024-03-01" },
      { cycleDay: 5, moodScore: 4, date: "2024-03-05" },
    ];
    render(<CycleHistoryItem cycle={mockCycle} moodTrend={trend} />);
    expect(screen.getByText(/Avg mood: 3.5/)).toBeTruthy();
  });

  it("does not render mood section without trend data", () => {
    render(<CycleHistoryItem cycle={mockCycle} />);
    expect(screen.queryByText(/Avg mood/)).toBeNull();
  });
});
