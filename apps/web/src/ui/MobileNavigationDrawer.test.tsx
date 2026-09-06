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

  it("opens nested Comercial with Clienți focused on /clients", async () => {
    const user = userEvent.setup();
    renderDrawer("/clients");
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Comercial" })).toBeInTheDocument();
    const clients = screen.getByRole("link", { name: "Clienți" });
    expect(clients).toHaveAttribute("aria-current", "page");
    expect(clients).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("opens nested Mai multe with Resurse focused on /admin/resources", async () => {
    const user = userEvent.setup();
    renderDrawer("/admin/resources");
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Mai multe" })).toBeInTheDocument();
    const resources = screen.getByRole("link", { name: "Resurse și costuri" });
    expect(resources).toHaveAttribute("aria-current", "page");
    expect(resources).toHaveFocus();
  });

  it("opens nested Mai multe with Angajați focused on /admin/people", async () => {
    const user = userEvent.setup();
    renderDrawer("/admin/people");
    await user.click(screen.getByRole("button", { name: "Meniu" }));
    expect(screen.getByRole("dialog", { name: "Mai multe" })).toBeInTheDocument();
    const people = screen.getByRole("link", { name: "Angajați" });
    expect(people).toHaveAttribute("aria-current", "page");
    expect(people).toHaveFocus();
  });

  it("closes from scrim and restores Meniu focus", async () => {
    const user = userEvent.setup();
    renderDrawer("/clients");
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    await user.click(screen.getAllByRole("button", { name: "Închide" })[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
