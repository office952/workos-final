import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { buildUi20PresentationModel } from "../navigation/ui20NavigationPresentation";
import {
  DEFAULT_NAVIGATION_VISIBILITY,
  resolveVisibleDestinations,
} from "../navigation/visibleNavigation";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";

function DrawerHost() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const model = buildUi20PresentationModel(
    resolveVisibleDestinations(DEFAULT_NAVIGATION_VISIBILITY),
    { pathname: location.pathname, search: location.search },
  );
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Meniu
      </button>
      <MobileNavigationDrawer open={open} onClose={() => setOpen(false)} model={model} />
    </>
  );
}

function renderDrawer(initial?: string) {
  return render(
    <MemoryRouter initialEntries={[initial ?? "/jobs"]}>
      <DrawerHost />
    </MemoryRouter>,
  );
}

describe("MobileNavigationDrawer", () => {
  it("focuses the active destination and returns focus to Meniu", async () => {
    const user = userEvent.setup();
    renderDrawer("/jobs");
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Meniu" });
    expect(dialog).toHaveClass("app-nav-drawer-panel");
    expect(within(dialog).getByRole("link", { name: "Lucrări" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(dialog).getByRole("link", { name: "Lucrări" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Meniu" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("opens nested Comercial from Mai multe-style drill-in and closes from scrim", async () => {
    const user = userEvent.setup();
    renderDrawer("/clients");
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Comercial" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Clienți" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getAllByRole("button", { name: "Închide" })[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
