import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Platform } from "react-native";
import {
  Cycle,
  MoodLog,
  AppSettings,
  PhaseInfo,
  CyclePrediction,
  DEFAULT_SETTINGS,
} from "../types";
import * as cycleRepo from "../repositories/cycleRepository";
import * as moodRepo from "../repositories/moodRepository";
import * as settingsRepo from "../repositories/settingsRepository";
import { getCurrentPhaseInfo } from "../services/cycleCalculator";
import { predictCycleLength } from "../services/predictionEngine";
import { schedulePhaseWarnings } from "../services/notificationService";

interface CycleContextType {
  // State
  cycles: Cycle[];
  moodLogs: MoodLog[];
  settings: AppSettings;
  currentCycle: Cycle | null;
  currentPhase: PhaseInfo | null;
  prediction: CyclePrediction | null;
  isLoading: boolean;
  hasOnboarded: boolean;

  // Actions
  addCycle: (
    startDate: string,
    cycleLength: number,
    notes?: string,
  ) => Promise<void>;
  updateCycle: (
    id: number,
    startDate: string,
    cycleLength: number,
    notes?: string,
  ) => Promise<void>;
  deleteCycle: (id: number) => Promise<void>;
  logMood: (date: string, score: number, notes?: string) => Promise<void>;
  deleteMoodLog: (id: number) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  refresh: () => Promise<void>;
}

const CycleContext = createContext<CycleContextType | null>(null);

export function CycleProvider({ children }: { children: ReactNode }) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const currentCycle = cycles.length > 0 ? cycles[0] : null;
  const currentPhase = currentCycle ? getCurrentPhaseInfo(currentCycle) : null;
  const prediction = cycles.length > 0 ? predictCycleLength(cycles) : null;
  const hasOnboarded = cycles.length > 0;

  const loadData = useCallback(async () => {
    try {
      const [loadedCycles, loadedMoods, loadedSettings] = await Promise.all([
        cycleRepo.getAllCycles(),
        moodRepo.getAllMoodLogs(),
        settingsRepo.getAllSettings(),
      ]);
      setCycles(loadedCycles);
      setMoodLogs(loadedMoods);
      setSettings(loadedSettings);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (
      Platform.OS !== "web" &&
      currentCycle &&
      settings.notifications_enabled
    ) {
      schedulePhaseWarnings(currentCycle, settings);
    }
  }, [currentCycle, settings]);

  const addCycle = useCallback(
    async (startDate: string, cycleLength: number, notes?: string) => {
      await cycleRepo.insertCycle(startDate, cycleLength, notes);
      await loadData();
    },
    [loadData],
  );

  const updateCycle = useCallback(
    async (
      id: number,
      startDate: string,
      cycleLength: number,
      notes?: string,
    ) => {
      await cycleRepo.updateCycle(id, startDate, cycleLength, notes);
      await loadData();
    },
    [loadData],
  );

  const deleteCycle = useCallback(
    async (id: number) => {
      await cycleRepo.deleteCycle(id);
      await loadData();
    },
    [loadData],
  );

  const logMood = useCallback(
    async (date: string, score: number, notes?: string) => {
      await moodRepo.upsertMoodLog(date, score, notes);
      await loadData();
    },
    [loadData],
  );

  const deleteMoodLog = useCallback(
    async (id: number) => {
      await moodRepo.deleteMoodLog(id);
      await loadData();
    },
    [loadData],
  );

  const updateSettings = useCallback(async (newSettings: AppSettings) => {
    await settingsRepo.saveAllSettings(newSettings);
    setSettings(newSettings);
  }, []);

  return (
    <CycleContext.Provider
      value={{
        cycles,
        moodLogs,
        settings,
        currentCycle,
        currentPhase,
        prediction,
        isLoading,
        hasOnboarded,
        addCycle,
        updateCycle,
        deleteCycle,
        logMood,
        deleteMoodLog,
        updateSettings,
        refresh: loadData,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle(): CycleContextType {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
}
