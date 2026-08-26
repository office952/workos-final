import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SkillsAdminPage } from "./SkillsAdminPage";

vi.mock("./peopleApi", () => ({
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
  fetchEligibility: () =>
    Promise.resolve({
      eligiblePeople: [{ personId: "per:florin", displayName: "Florin CNC" }],
    }),
  createSkill: vi.fn(),
  retireSkill: vi.fn(),
}));

describe("SkillsAdminPage", () => {
  it("lists the skill catalog and current eligibility without permission language", async () => {
    render(
      <MemoryRouter>
        <SkillsAdminPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Calificări" })).toBeInTheDocument();
    expect(screen.getByText("CNC")).toBeInTheDocument();
    expect(screen.getByText("SK_CNC_OPERATOR")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Eligibilitate curentă" })).toBeInTheDocument();
    expect(screen.getByText("Florin CNC")).toBeInTheDocument();
    expect(screen.queryByText("RBAC")).not.toBeInTheDocument();
    expect(screen.queryByText("permission")).not.toBeInTheDocument();
  });
});
