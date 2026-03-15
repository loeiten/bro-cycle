import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import { Text, TouchableOpacity } from "react-native";
import { CycleProvider, useCycle } from "../../src/context/CycleContext";

// Mock the repositories
jest.mock("../../src/repositories/cycleRepository", () => ({
  getAllCycles: jest.fn().mockResolvedValue([]),
  getLatestCycle: jest.fn().mockResolvedValue(null),
  insertCycle: jest.fn().mockResolvedValue({
    id: 1,
    start_date: "2024-03-01",
    cycle_length: 28,
    notes: null,
    created_at: "2024-03-01T00:00:00",
  }),
  deleteCycle: jest.fn().mockResolvedValue(undefined),
  getCycleCount: jest.fn().mockResolvedValue(0),
}));

jest.mock("../../src/repositories/moodRepository", () => ({
  getAllMoodLogs: jest.fn().mockResolvedValue([]),
  upsertMoodLog: jest.fn().mockResolvedValue({
    id: 1,
    date: "2024-03-15",
    mood_score: 4,
    notes: null,
    created_at: "2024-03-15T00:00:00",
  }),
  deleteMoodLog: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../src/repositories/settingsRepository", () => ({
  getAllSettings: jest.fn().mockResolvedValue({
    default_cycle_length: 28,
    notifications_enabled: true,
    luteal_warning_days_before: 2,
    pms_warning_days_before: 2,
  }),
  saveAllSettings: jest.fn().mockResolvedValue(undefined),
}));

const cycleRepo = require("../../src/repositories/cycleRepository");
const moodRepo = require("../../src/repositories/moodRepository");
const settingsRepo = require("../../src/repositories/settingsRepository");

function TestConsumer() {
  const ctx = useCycle();

  if (ctx.isLoading) return <Text>Loading...</Text>;

  return (
    <>
      <Text testID="hasOnboarded">{String(ctx.hasOnboarded)}</Text>
      <Text testID="cycleCount">{ctx.cycles.length}</Text>
      <Text testID="defaultLength">{ctx.settings.default_cycle_length}</Text>
      <Text testID="currentPhase">{ctx.currentPhase?.phase ?? "none"}</Text>
      <TouchableOpacity
        testID="addCycle"
        onPress={() => ctx.addCycle("2024-03-01", 28)}
      />
      <TouchableOpacity
        testID="deleteCycle"
        onPress={() => ctx.deleteCycle(1)}
      />
      <TouchableOpacity
        testID="logMood"
        onPress={() => ctx.logMood("2024-03-15", 4)}
      />
      <TouchableOpacity
        testID="deleteMoodLog"
        onPress={() => ctx.deleteMoodLog(1)}
      />
      <TouchableOpacity
        testID="updateSettings"
        onPress={() =>
          ctx.updateSettings({
            default_cycle_length: 30,
            notifications_enabled: false,
            luteal_warning_days_before: 3,
            pms_warning_days_before: 3,
          })
        }
      />
      <TouchableOpacity testID="refresh" onPress={ctx.refresh} />
    </>
  );
}

describe("CycleContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cycleRepo.getAllCycles.mockResolvedValue([]);
    moodRepo.getAllMoodLogs.mockResolvedValue([]);
    settingsRepo.getAllSettings.mockResolvedValue({
      default_cycle_length: 28,
      notifications_enabled: true,
      luteal_warning_days_before: 2,
      pms_warning_days_before: 2,
    });
  });

  it("loads data and shows hasOnboarded=false with no cycles", async () => {
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("hasOnboarded").props.children).toBe("false");
    });
  });

  it("shows hasOnboarded=true with cycles", async () => {
    cycleRepo.getAllCycles.mockResolvedValue([
      {
        id: 1,
        start_date: "2024-03-01",
        cycle_length: 28,
        notes: null,
        created_at: "2024-03-01",
      },
    ]);
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("hasOnboarded").props.children).toBe("true");
    });
  });

  it("provides currentPhase when cycle exists", async () => {
    cycleRepo.getAllCycles.mockResolvedValue([
      {
        id: 1,
        start_date: "2024-03-01",
        cycle_length: 28,
        notes: null,
        created_at: "2024-03-01",
      },
    ]);
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("currentPhase").props.children).not.toBe(
        "none",
      );
    });
  });

  it("calls addCycle and refreshes data", async () => {
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("addCycle")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("addCycle"));
    await waitFor(() => {
      expect(cycleRepo.insertCycle).toHaveBeenCalledWith(
        "2024-03-01",
        28,
        undefined,
      );
    });
  });

  it("calls deleteCycle", async () => {
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("deleteCycle")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("deleteCycle"));
    await waitFor(() => {
      expect(cycleRepo.deleteCycle).toHaveBeenCalledWith(1);
    });
  });

  it("calls logMood", async () => {
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("logMood")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("logMood"));
    await waitFor(() => {
      expect(moodRepo.upsertMoodLog).toHaveBeenCalledWith(
        "2024-03-15",
        4,
        undefined,
      );
    });
  });

  it("calls deleteMoodLog", async () => {
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("deleteMoodLog")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("deleteMoodLog"));
    await waitFor(() => {
      expect(moodRepo.deleteMoodLog).toHaveBeenCalledWith(1);
    });
  });

  it("calls updateSettings", async () => {
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("updateSettings")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("updateSettings"));
    await waitFor(() => {
      expect(settingsRepo.saveAllSettings).toHaveBeenCalled();
    });
  });

  it("throws when useCycle is used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<TestConsumer />)).toThrow(
      "useCycle must be used within a CycleProvider",
    );
    spy.mockRestore();
  });

  it("handles load error gracefully", async () => {
    cycleRepo.getAllCycles.mockRejectedValueOnce(new Error("DB error"));
    const spy = jest.spyOn(console, "error").mockImplementation();
    render(
      <CycleProvider>
        <TestConsumer />
      </CycleProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("hasOnboarded")).toBeTruthy();
    });
    spy.mockRestore();
  });
});
