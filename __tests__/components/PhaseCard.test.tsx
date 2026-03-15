import React from "react";
import { render, screen } from "@testing-library/react-native";
import { PhaseCard } from "../../src/components/PhaseCard";
import { CyclePhase } from "../../src/types";

describe("PhaseCard", () => {
  it("renders phase name", () => {
    render(
      <PhaseCard
        phase={CyclePhase.Menstrual}
        dayInPhase={3}
        totalPhaseDays={7}
      />,
    );
    expect(screen.getByText("Menstrual Phase")).toBeTruthy();
  });

  it("renders day count", () => {
    render(
      <PhaseCard
        phase={CyclePhase.Follicular}
        dayInPhase={2}
        totalPhaseDays={7}
      />,
    );
    expect(screen.getByText("Day 2 of 7")).toBeTruthy();
  });

  it("renders phase description", () => {
    render(
      <PhaseCard phase={CyclePhase.Luteal} dayInPhase={1} totalPhaseDays={7} />,
    );
    expect(screen.getByText(/Mood shifts may begin/)).toBeTruthy();
  });
});
