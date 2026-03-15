import React from "react";
import { render, screen } from "@testing-library/react-native";
import { CycleTimeline } from "../../src/components/CycleTimeline";
import { CyclePhase, PhaseInfo } from "../../src/types";

const makePhaseInfo = (
  phase: CyclePhase = CyclePhase.Menstrual,
): PhaseInfo => ({
  phase,
  dayInPhase: 3,
  totalPhaseDays: 7,
  dayInCycle: 3,
  totalCycleDays: 28,
  isOverdue: false,
});

describe("CycleTimeline", () => {
  it("renders all phase labels", () => {
    render(<CycleTimeline phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("Menstrual")).toBeTruthy();
    expect(screen.getByText("Follicular")).toBeTruthy();
    expect(screen.getByText("Luteal")).toBeTruthy();
    expect(screen.getByText("PMS")).toBeTruthy();
  });

  it("renders with different active phase", () => {
    render(<CycleTimeline phaseInfo={makePhaseInfo(CyclePhase.Luteal)} />);
    expect(screen.getByText("Luteal")).toBeTruthy();
  });
});
