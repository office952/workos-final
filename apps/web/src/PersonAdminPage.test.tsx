import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PersonAdminPage } from "./PersonAdminPage";

vi.mock("./operatorSessionApi", () => ({
  setOperatorPin: vi.fn(),
}));

vi.mock("./peopleApi", () => ({
  fetchPerson: () =>
    Promise.resolve({
      person: {
        personId: "per:test",
        displayName: "Mihai Test",
        status: "ACTIVE",
        availability: "AVAILABLE",
        unavailableReason: null,
        unavailableUntil: null,
        roleLabel: "Operator CNC",
        provenance: "MANUAL",
        createdAt: "2026-08-17T12:00:00.000Z",
        updatedAt: "2026-08-17T12:00:00.000Z",
        availabilityUpdatedAt: "2026-08-17T12:00:00.000Z",
        retiredAt: null,
      },
      operatorPinConfigured: false,
      item: {
        personId: "per:test",
        displayName: "Mihai Test",
        status: "ACTIVE",
        availability: "AVAILABLE",
        unavailableReason: null,
        unavailableUntil: null,
        roleLabel: "Operator CNC",
        provenance: "MANUAL",
        createdAt: "2026-08-17T12:00:00.000Z",
        updatedAt: "2026-08-17T12:00:00.000Z",
        availabilityUpdatedAt: "2026-08-17T12:00:00.000Z",
        retiredAt: null,
        statusLabel: "Activ",
        availabilityLabel: "Disponibil",
        skills: [
          {
            skillId: "skl:cnc",
            code: "SK_CNC_OPERATOR",
            displayLabel: "CNC",
            status: "ACTIVE",
          },
        ],
        href: "/admin/people/per%3Atest",
      },
    }),
  fetchSkills: () =>
    Promise.resolve([
      {
        skillId: "skl:cnc",
        code: "SK_CNC_OPERATOR",
        displayLabel: "CNC",
        status: "ACTIVE",
        createdAt: "2026-08-17T12:00:00.000Z",
        updatedAt: "2026-08-17T12:00:00.000Z",
        retiredAt: null,
        description: null,
      },
    ]),
  updatePerson: vi.fn(),
  retirePerson: vi.fn(),
  assignPersonSkill: vi.fn(),
  removePersonSkill: vi.fn(),
}));

describe("PersonAdminPage", () => {
  it("shows identity, availability and skills without HR fields", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/people/per:test"]}>
        <Routes>
          <Route path="/admin/people/:personId" element={<PersonAdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Mihai Test" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PIN operator" })).toBeInTheDocument();
    expect(screen.getByText("Neconfigurat")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Disponibilitate operațională" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skill-uri" })).toBeInTheDocument();
    expect(screen.getByText("CNC")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marchează indisponibil temporar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retrage persoana" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Salariu")).not.toBeInTheDocument();
    expect(screen.queryByText("per:test")).not.toBeInTheDocument();
  });
});
