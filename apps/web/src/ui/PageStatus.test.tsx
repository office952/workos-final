import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageStatus } from "./PageStatus";

describe("PageStatus", () => {
  it("announces loading politely and errors as alerts", () => {
    const loadingView = render(
      <PageStatus kind="loading">Se încarcă catalogul de resurse…</PageStatus>,
    );
    const loading = screen.getByRole("status");
    expect(loading).toHaveAttribute("aria-live", "polite");
    expect(loading).toHaveTextContent("Se încarcă catalogul de resurse…");
    loadingView.unmount();

    render(<PageStatus kind="error">Nu s-a putut încărca catalogul de resurse.</PageStatus>);
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Nu s-a putut încărca catalogul de resurse.");
    expect(error).not.toHaveAttribute("aria-live");
  });

  it("does not announce missing or forbidden as live status", () => {
    const missingView = render(<PageStatus kind="missing">Element inexistent</PageStatus>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Element inexistent")).toBeInTheDocument();
    missingView.unmount();

    render(<PageStatus kind="forbidden">Nu ai acces.</PageStatus>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
