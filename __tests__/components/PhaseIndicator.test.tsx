import React from "react";
import { render, screen } from "@testing-library/react-native";
import { PhaseIndicator } from "../../src/components/PhaseIndicator";
import { CyclePhase, PhaseInfo } from "../../src/types";

const makePhaseInfo = (overrides?: Partial<PhaseInfo>): PhaseInfo => ({
  phase: CyclePhase.Menstrual,
  dayInPhase: 3,
  totalPhaseDays: 7,
  dayInCycle: 3,
  totalCycleDays: 28,
  isOverdue: false,
  ...overrides,
});

describe("PhaseIndicator", () => {
  it("renders day number", () => {
    render(<PhaseIndicator phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders phase name", () => {
    render(<PhaseIndicator phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("Menstrual")).toBeTruthy();
  });

  it("renders cycle day info", () => {
    render(<PhaseIndicator phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("of 28 days")).toBeTruthy();
  });

  it("shows overdue text when overdue", () => {
    render(
      <PhaseIndicator
        phaseInfo={makePhaseInfo({
          isOverdue: true,
          dayInCycle: 35,
        })}
      />,
    );
    expect(screen.getByText("35")).toBeTruthy();
    expect(screen.getByText("days (overdue)")).toBeTruthy();
  });

  it("renders different phases", () => {
    render(
      <PhaseIndicator
        phaseInfo={makePhaseInfo({ phase: CyclePhase.Follicular })}
      />,
    );
    expect(screen.getByText("Follicular")).toBeTruthy();
  });
});
