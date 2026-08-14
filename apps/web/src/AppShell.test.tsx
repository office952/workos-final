import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("shows the Romanian shell chrome without internal capability names", () => {
    render(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );

    expect(screen.getByText("WorkOS Final")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigare principală" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stare sistem" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("conținut")).toBeInTheDocument();
    expect(screen.queryByText("PRODUCT")).not.toBeInTheDocument();
    expect(screen.queryByText("TRUTH_COMPILER")).not.toBeInTheDocument();
    expect(screen.queryByText("RESOURCES_COST")).not.toBeInTheDocument();
  });
});
