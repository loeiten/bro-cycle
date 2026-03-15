import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { DatePickerInput } from "../../src/components/DatePickerInput";

describe("DatePickerInput", () => {
  it("renders label", () => {
    render(
      <DatePickerInput
        label="Pick a date"
        value={new Date(2024, 2, 15)}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText("Pick a date")).toBeTruthy();
  });

  it("renders formatted date", () => {
    render(
      <DatePickerInput
        label="Date"
        value={new Date(2024, 2, 15)}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText("Mar 15, 2024")).toBeTruthy();
  });

  it("calls onChange when going back a day", () => {
    const onChange = jest.fn();
    render(
      <DatePickerInput
        label="Date"
        value={new Date(2024, 2, 15)}
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByLabelText("Previous day"));
    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];
    expect(newDate.getDate()).toBe(14);
  });

  it("calls onChange when going forward a day", () => {
    const onChange = jest.fn();
    render(
      <DatePickerInput
        label="Date"
        value={new Date(2024, 2, 15)}
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByLabelText("Next day"));
    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];
    expect(newDate.getDate()).toBe(16);
  });

  it("does not go past maximumDate", () => {
    const onChange = jest.fn();
    const max = new Date(2024, 2, 15);
    render(
      <DatePickerInput
        label="Date"
        value={new Date(2024, 2, 15)}
        onChange={onChange}
        maximumDate={max}
      />,
    );
    fireEvent.press(screen.getByLabelText("Next day"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
