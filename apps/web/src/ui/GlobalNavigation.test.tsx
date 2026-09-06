import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { buildUi20PresentationModel } from "../navigation/ui20NavigationPresentation";
import {
  DEFAULT_NAVIGATION_VISIBILITY,
  resolveVisibleDestinations,
} from "../navigation/visibleNavigation";
import { GlobalNavigation } from "./GlobalNavigation";

function renderNav(pathname = "/jobs") {
  const model = buildUi20PresentationModel(
    resolveVisibleDestinations(DEFAULT_NAVIGATION_VISIBILITY),
    { pathname, search: "" },
  );
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <GlobalNavigation model={model} />
    </MemoryRouter>,
  );
}

describe("GlobalNavigation", () => {
  it("restores focus to Comercial after Escape from a panel link", async () => {
    const user = userEvent.setup();
    renderNav("/jobs");
    const trigger = screen.getByRole("button", { name: "Comercial" });
    await user.click(trigger);
    const panel = screen.getByRole("region", { name: "Comercial" });
    const clients = within(panel).getByRole("link", { name: "Clienți" });
    clients.focus();
    expect(clients).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: "Comercial" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps focus on Mai multe when Escape closes while the trigger is focused", async () => {
    const user = userEvent.setup();
    renderNav("/jobs");
    const trigger = screen.getByRole("button", { name: "Mai multe" });
    await user.click(trigger);
    expect(screen.getByRole("region", { name: "Mai multe" })).toBeInTheDocument();
    trigger.focus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: "Mai multe" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
