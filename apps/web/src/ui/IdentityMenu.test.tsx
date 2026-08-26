import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../theme/ThemeProvider";
import { IdentityMenu } from "./IdentityMenu";

describe("IdentityMenu", () => {
  it("wraps a long legal name inside a 44px Cont trigger", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <IdentityMenu
          shortName="Atelier Demo"
          legalName="Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L."
          accountLabel="owner@example.test"
          onLogout={() => undefined}
        />
      </ThemeProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Cont" });
    expect(trigger).toBeInTheDocument();
    await user.click(trigger);
    expect(
      screen.getByText(
        "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ieși din cont" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Temă" })).toBeInTheDocument();
  });
});
