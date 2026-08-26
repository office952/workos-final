import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ActionDrawer } from "./ActionDrawer";

function DrawerHost() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Client nou
      </button>
      <ActionDrawer title="Client nou" open={open} onClose={() => setOpen(false)}>
        <input aria-label="Nume afișat" />
        <button type="button" onClick={() => setOpen(false)}>
          Anulează
        </button>
      </ActionDrawer>
    </>
  );
}

describe("ActionDrawer", () => {
  it("traps focus and returns it to the opener", async () => {
    render(<DrawerHost />);
    const opener = screen.getByRole("button", { name: "Client nou" });
    await userEvent.click(opener);
    expect(screen.getByRole("dialog", { name: "Client nou" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
