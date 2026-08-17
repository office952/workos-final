import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PeopleAdminPage } from "./PeopleAdminPage";

vi.mock("./peopleApi", () => ({
  fetchPeopleRegistry: () =>
    Promise.resolve({
      summary: {
        total: 0,
        active: 0,
        available: 0,
        temporarilyUnavailable: 0,
        retired: 0,
      },
      people: [],
    }),
  createPerson: vi.fn(),
}));

describe("PeopleAdminPage", () => {
  it("shows a useful empty state without HR fields", async () => {
    render(
      <MemoryRouter>
        <PeopleAdminPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Oameni" })).toBeInTheDocument();
    expect(screen.getByText("Nu există persoane active configurate.")).toBeInTheDocument();
    expect(screen.getByText("Adaugă prima persoană.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adaugă persoană" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skill-uri" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Salariu")).not.toBeInTheDocument();
    expect(screen.queryByText("person_id")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Șterge" })).not.toBeInTheDocument();
  });
});
