import React from "react";
import { render, screen } from "@testing-library/react-native";
import { VerticalTimeline } from "../../src/components/VerticalTimeline";
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

describe("VerticalTimeline", () => {
  it("renders all four phase names", () => {
    render(<VerticalTimeline phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("Menstrual")).toBeTruthy();
    expect(screen.getByText("Follicular")).toBeTruthy();
    expect(screen.getByText("Luteal")).toBeTruthy();
    expect(screen.getByText("PMS")).toBeTruthy();
  });

  it("shows active day info for current phase", () => {
    render(<VerticalTimeline phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("Day 3 of 28")).toBeTruthy();
  });

  it("renders day labels", () => {
    render(<VerticalTimeline phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("Day 1")).toBeTruthy();
  });

  it("renders tips for each phase", () => {
    render(<VerticalTimeline phaseInfo={makePhaseInfo()} />);
    expect(screen.getByText("Rest & comfort")).toBeTruthy();
    expect(screen.getByText("Energy rising!")).toBeTruthy();
    expect(screen.getByText("Be patient & kind")).toBeTruthy();
    expect(screen.getByText("Extra care needed")).toBeTruthy();
  });

  it("shows overdue indicator when overdue", () => {
    render(
      <VerticalTimeline
        phaseInfo={makePhaseInfo({
          isOverdue: true,
          dayInCycle: 35,
        })}
      />,
    );
    expect(screen.getByText(/Day 35 — Cycle may be overdue/)).toBeTruthy();
  });

  it("does not show overdue when not overdue", () => {
    render(<VerticalTimeline phaseInfo={makePhaseInfo()} />);
    expect(screen.queryByText(/overdue/)).toBeNull();
  });

  it("renders correctly for follicular phase", () => {
    render(
      <VerticalTimeline
        phaseInfo={makePhaseInfo({
          phase: CyclePhase.Follicular,
          dayInCycle: 10,
          dayInPhase: 3,
          totalPhaseDays: 7,
        })}
      />,
    );
    expect(screen.getByText("Day 10 of 28")).toBeTruthy();
  });

  it("renders correctly for PMS phase", () => {
    render(
      <VerticalTimeline
        phaseInfo={makePhaseInfo({
          phase: CyclePhase.PMS,
          dayInCycle: 25,
          dayInPhase: 4,
          totalPhaseDays: 7,
        })}
      />,
    );
    expect(screen.getByText("Day 25 of 28")).toBeTruthy();
  });
});
