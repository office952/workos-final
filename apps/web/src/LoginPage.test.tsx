import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { loginCloud } from "./cloudSessionApi";
import { CloudSessionProvider } from "./CloudSessionContext";
import { LoginPage } from "./LoginPage";
import { ThemeProvider } from "./theme/ThemeProvider";

vi.mock("./cloudSessionApi", () => ({
  fetchCloudSession: vi.fn(async () => ({
    mode: "cloud",
    user: null,
    organization: null,
    memberships: [],
  })),
  loginCloud: vi.fn(),
  logoutCloud: vi.fn(),
  switchCloudOrganization: vi.fn(),
}));

describe("LoginPage", () => {
  it("shows Romanian login fields without internal jargon", async () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/atelier"]}>
          <CloudSessionProvider>
            <LoginPage />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Autentificare" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Parolă")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Intră" })).toBeInTheDocument();
    expect(screen.queryByText("Control Plane")).not.toBeInTheDocument();
    expect(screen.queryByText("organization_id")).not.toBeInTheDocument();
  });

  it("puts the login skip link first in tab order and moves focus into main", async () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/atelier"]}>
          <CloudSessionProvider>
            <LoginPage />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    const skip = await screen.findByRole("link", { name: "Sari la autentificare" });
    expect(skip).toHaveAttribute("href", "#autentificare");
    const user = userEvent.setup();
    await user.tab();
    expect(skip).toHaveFocus();
    await user.click(skip);
    expect(document.getElementById("autentificare")).toHaveFocus();
  });

  it("asks for an organization when the account has more than one", async () => {
    vi.mocked(loginCloud).mockResolvedValueOnce({
      ok: false,
      error: "organization_selection_required",
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
          displayName: "Atelier Beta",
          slug: "beta",
          role: "member",
          status: "ACTIVE",
        },
      ],
    });

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/atelier"]}>
          <CloudSessionProvider>
            <LoginPage />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    await userEvent.type(screen.getByLabelText("Email"), "owner@example.test");
    await userEvent.type(screen.getByLabelText("Parolă"), "OwnerPass12");
    await userEvent.click(screen.getByRole("button", { name: "Intră" }));

    expect(await screen.findByLabelText("Organizație")).toBeInTheDocument();
    expect(screen.getByText("Alege organizația pentru acest cont.")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Atelier Alpha" })).toBeInTheDocument();
  });

  it("keeps missing Cloud config distinct from invalid credentials", async () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <CloudSessionProvider>
            <LoginPage gate="auth_config_missing" />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );
    expect(
      await screen.findByRole("heading", { name: "Autentificare indisponibilă" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nu este o problemă de email sau parolă/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("shows a boot gate without login fields", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <CloudSessionProvider>
            <LoginPage gate="boot" />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );
    expect(screen.getByRole("heading", { name: "Se încarcă" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("shows session expiry without treating it as a wrong password", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <CloudSessionProvider>
            <LoginPage gate="session_expired" />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );
    expect(screen.getByText("Sesiunea a expirat. Autentifică-te din nou.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.queryByText("Email sau parolă greșită.")).not.toBeInTheDocument();
  });

  it("shows a field-associated invalid login without repeating the password", async () => {
    vi.mocked(loginCloud).mockResolvedValueOnce({
      ok: false,
      error: "invalid_credentials",
    });
    render(
      <ThemeProvider>
        <MemoryRouter>
          <CloudSessionProvider>
            <LoginPage />
          </CloudSessionProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );
    await userEvent.type(screen.getByLabelText("Email"), "owner@example.test");
    await userEvent.type(screen.getByLabelText("Parolă"), "wrong-pass");
    await userEvent.click(screen.getByRole("button", { name: "Intră" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email sau parolă greșită.");
    expect(screen.queryByText("wrong-pass")).not.toBeInTheDocument();
  });
});
