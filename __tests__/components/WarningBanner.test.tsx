import React from "react";
import { render, screen } from "@testing-library/react-native";
import { WarningBanner } from "../../src/components/WarningBanner";

describe("WarningBanner", () => {
  it("renders warning message", () => {
    render(<WarningBanner message="Watch out!" type="warning" />);
    expect(screen.getByText("Watch out!")).toBeTruthy();
  });

  it("renders info message", () => {
    render(<WarningBanner message="FYI" type="info" />);
    expect(screen.getByText("FYI")).toBeTruthy();
  });

  it("renders overdue message", () => {
    render(<WarningBanner message="Overdue!" type="overdue" />);
    expect(screen.getByText("Overdue!")).toBeTruthy();
  });
});
