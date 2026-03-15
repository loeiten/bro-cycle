import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { MoodInput } from "../../src/components/MoodInput";

describe("MoodInput", () => {
  it("renders all 5 mood tier labels", () => {
    render(<MoodInput value={null} onSelect={jest.fn()} />);
    expect(screen.getByText(/Awful/)).toBeTruthy();
    expect(screen.getByText(/Bad/)).toBeTruthy();
    expect(screen.getByText(/Okay/)).toBeTruthy();
    expect(screen.getByText(/Good/)).toBeTruthy();
    expect(screen.getByText(/Great/)).toBeTruthy();
  });

  it("calls onSelect when mood is tapped", () => {
    const onSelect = jest.fn();
    render(<MoodInput value={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByLabelText("Mood: Happy"));
    expect(onSelect).toHaveBeenCalledWith(4);
  });

  it("renders title", () => {
    render(<MoodInput value={null} onSelect={jest.fn()} />);
    expect(screen.getByText("How is she feeling today?")).toBeTruthy();
  });
});
