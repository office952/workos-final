import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../theme/ThemeProvider";
import { IdentityMenu } from "./IdentityMenu";

function renderMenu(
  props: Partial<Parameters<typeof IdentityMenu>[0]> = {},
) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <IdentityMenu shortName="Atelier Demo" {...props} />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("IdentityMenu", () => {
  it("shows organization then account on the trigger, not the legal name", async () => {
    const user = userEvent.setup();
    renderMenu({
      shortName: "HUB MEDIA",
      legalName: "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
      accountLabel: "owner@example.test",
      onLogout: () => undefined,
    });

    const trigger = screen.getByRole("button", { name: "HUB MEDIA. owner@example.test" });
    expect(trigger).toHaveTextContent("HUB MEDIA");
    expect(trigger).toHaveTextContent("owner@example.test");
    expect(trigger).not.toHaveTextContent(
      "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
    );
    expect(trigger).not.toHaveTextContent(/^Cont$/);

    await user.click(trigger);
    expect(
      screen.getByText(
        "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ieși din cont" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Administrare" })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("group", { name: "Temă" })).toBeInTheDocument();
  });

  it("wraps a long legal name in the dropdown instead of a fixed tiny width", async () => {
    const user = userEvent.setup();
    renderMenu({
      shortName: "Atelier Demo",
      legalName: "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
      accountLabel: "owner@example.test",
    });

    await user.click(screen.getByRole("button", { name: "Atelier Demo. owner@example.test" }));
    const legal = screen.getByText(
      "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
    );
    const style = getComputedStyle(legal);
    expect(style.whiteSpace).not.toBe("nowrap");
    expect(legal.parentElement).toHaveClass("identity-menu-name");
  });

  it("keeps long organization and account on the compact trigger, not the legal name", () => {
    const shortName = "Organizația Comercială Demonstrativă HUB MEDIA Extended";
    const accountLabel = "remus.foarte.lung@company.example.test";
    const { container } = renderMenu({
      shortName,
      legalName: "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
      accountLabel,
    });
    const trigger = screen.getByRole("button", { name: `${shortName}. ${accountLabel}` });
    expect(container.querySelector(".identity-menu-trigger-org")).toHaveTextContent(shortName);
    expect(container.querySelector(".identity-menu-trigger-account")).toHaveTextContent(
      accountLabel,
    );
    expect(trigger).toHaveClass("identity-menu-trigger");
    expect(trigger).not.toHaveTextContent(
      "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.",
    );
  });

  it("keeps the organization switcher when multiple memberships exist", async () => {
    const user = userEvent.setup();
    renderMenu({
      shortName: "Atelier Alpha",
      accountLabel: "user.c@isolation.test",
      currentOrganizationId: "org:a",
      onSwitchOrganization: () => undefined,
      memberships: [
        {
          organizationId: "org:a",
          displayName: "Atelier Alpha",
          slug: "alpha",
          role: "owner",
          status: "ACTIVE",
        },
        {
          organizationId: "org:b",
          displayName: "TEST COMPANY",
          slug: "test-company",
          role: "owner",
          status: "ACTIVE",
        },
      ],
    });

    await user.click(screen.getByRole("button", { name: "Atelier Alpha. user.c@isolation.test" }));
    expect(screen.getByLabelText("Schimbă organizația")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "TEST COMPANY" })).toBeInTheDocument();
  });
});
