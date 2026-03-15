import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { InsightCard } from "../../src/components/InsightCard";

const mockItem = {
  id: "test-1",
  title: "Test Insight",
  content: "This is the content of the insight.",
  emoji: "\uD83D\uDCA1",
  shortTip: "A short tip for display",
};

describe("InsightCard", () => {
  it("renders title", () => {
    render(<InsightCard item={mockItem} />);
    expect(screen.getByText("Test Insight")).toBeTruthy();
  });

  it("does not show content initially", () => {
    render(<InsightCard item={mockItem} />);
    expect(
      screen.queryByText("This is the content of the insight."),
    ).toBeNull();
  });

  it("shows content when pressed", () => {
    render(<InsightCard item={mockItem} />);
    fireEvent.press(screen.getByLabelText("Test Insight"));
    expect(
      screen.getByText("This is the content of the insight."),
    ).toBeTruthy();
  });

  it("hides content when pressed again", () => {
    render(<InsightCard item={mockItem} />);
    fireEvent.press(screen.getByLabelText("Test Insight"));
    fireEvent.press(screen.getByLabelText("Test Insight"));
    expect(
      screen.queryByText("This is the content of the insight."),
    ).toBeNull();
  });
});
