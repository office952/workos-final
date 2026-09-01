import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders already-derived facts without inventing values", () => {
    render(
      <MetricCard
        label="Clienți"
        value={12}
        hint="3 necesită atenție"
        icon={<span data-testid="metric-icon" />}
      />,
    );
    expect(screen.getByText("Clienți")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3 necesită atenție")).toBeInTheDocument();
    expect(screen.getByTestId("metric-icon")).toBeInTheDocument();
  });
});
