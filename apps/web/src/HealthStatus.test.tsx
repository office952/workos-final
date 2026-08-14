import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HealthStatus } from "./HealthStatus";

describe("HealthStatus", () => {
  it("shows the Romanian connected state", () => {
    render(<HealthStatus state={{ kind: "connected" }} />);
    expect(screen.getByText("Backend conectat")).toBeInTheDocument();
  });

  it("shows the Romanian unavailable state", () => {
    render(<HealthStatus state={{ kind: "unavailable" }} />);
    expect(screen.getByText("Backend indisponibil")).toBeInTheDocument();
  });
});
