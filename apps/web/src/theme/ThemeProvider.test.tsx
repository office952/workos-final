import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function ThemeProbe() {
  const { choice, setChoice } = useTheme();
  return (
    <div>
      <p>alegere:{choice}</p>
      <button type="button" onClick={() => setChoice("dark")}>
        Dark
      </button>
      <button type="button" onClick={() => setChoice("light")}>
        Light
      </button>
      <button type="button" onClick={() => setChoice("system")}>
        System
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("persists an explicit LIGHT or DARK override", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Dark" }));
    expect(screen.getByText("alegere:dark")).toBeInTheDocument();
    expect(window.localStorage.getItem("workos.theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    await user.click(screen.getByRole("button", { name: "System" }));
    expect(window.localStorage.getItem("workos.theme")).toBeNull();
  });

  it("follows OS when no preference is stored and keeps an explicit LIGHT override", async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem("workos.theme");
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("dark"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }),
    });
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByText("alegere:system")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("workos.theme")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Light" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("workos.theme")).toBe("light");
  });
});
