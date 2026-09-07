import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Ui20Shell } from "./Ui20Shell";

vi.mock("../../OperatorSessionContext", () => ({
  useOperatorSession: () => ({
    operator: null,
    logout: vi.fn(),
    ready: true,
    expired: false,
  }),
}));

vi.mock("../../theme/ThemeSwitcher", () => ({
  ThemeSwitcher: () => <div>Temă</div>,
}));

describe("Ui20Shell", () => {
  it("does not render a global Atelier shortcut", () => {
    render(
      <MemoryRouter initialEntries={["/requests/crq:1"]}>
        <Ui20Shell>
          <p>conținut</p>
        </Ui20Shell>
      </MemoryRouter>,
    );
    expect(screen.queryByRole("link", { name: "Atelier" })).toBeNull();
    expect(document.querySelector(".ui20-destination")?.textContent).toBe("Cerere");
  });
});
