import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { resolveVisibleDestinations, DEFAULT_NAVIGATION_VISIBILITY } from "../navigation/visibleNavigation";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";

function DrawerHost({ initial = "/governance" }: { initial?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <MemoryRouter initialEntries={[initial]}>
      <button type="button" onClick={() => setOpen(true)}>
        Meniu
      </button>
      <MobileNavigationDrawer
        open={open}
        onClose={() => setOpen(false)}
        destinations={resolveVisibleDestinations(DEFAULT_NAVIGATION_VISIBILITY)}
      />
    </MemoryRouter>
  );
}

describe("MobileNavigationDrawer", () => {
  it("focuses the active destination and returns focus to Meniu", async () => {
    const user = userEvent.setup();
    render(<DrawerHost />);
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Meniu" });
    expect(dialog).toHaveClass("app-nav-drawer-panel");
    expect(within(dialog).getByRole("link", { name: "Guvernanță" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(dialog).getByRole("link", { name: "Guvernanță" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Meniu" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("closes from the scrim and returns focus to Meniu", async () => {
    const user = userEvent.setup();
    render(<DrawerHost />);
    const opener = screen.getByRole("button", { name: "Meniu" });
    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Meniu" })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Închide" })[0]);
    expect(screen.queryByRole("dialog", { name: "Meniu" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
