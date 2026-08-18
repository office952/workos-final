import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { loginCloud } from "./cloudSessionApi";
import { CloudSessionProvider } from "./CloudSessionContext";
import { LoginPage } from "./LoginPage";

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
      <CloudSessionProvider>
        <LoginPage />
      </CloudSessionProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Autentificare" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Parolă")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Intră" })).toBeInTheDocument();
    expect(screen.queryByText("Control Plane")).not.toBeInTheDocument();
    expect(screen.queryByText("organization_id")).not.toBeInTheDocument();
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
      <CloudSessionProvider>
        <LoginPage />
      </CloudSessionProvider>,
    );

    await userEvent.type(screen.getByLabelText("Email"), "owner@example.test");
    await userEvent.type(screen.getByLabelText("Parolă"), "OwnerPass12");
    await userEvent.click(screen.getByRole("button", { name: "Intră" }));

    expect(await screen.findByLabelText("Organizație")).toBeInTheDocument();
    expect(screen.getByText("Alege organizația pentru acest cont.")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Atelier Alpha" })).toBeInTheDocument();
  });
});
