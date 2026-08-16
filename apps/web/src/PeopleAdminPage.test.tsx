import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PeopleAdminPage } from "./PeopleAdminPage";

vi.mock("./peopleApi", () => ({
  fetchPeople: () => Promise.resolve([]),
  createPerson: vi.fn(),
  renamePerson: vi.fn(),
  retirePerson: vi.fn(),
}));

describe("PeopleAdminPage", () => {
  it("shows a useful empty state without HR fields", async () => {
    render(<PeopleAdminPage />);
    expect(await screen.findByRole("heading", { name: "Persoane" })).toBeInTheDocument();
    expect(screen.getByText("Nu există persoane active configurate.")).toBeInTheDocument();
    expect(screen.getByText("Adaugă prima persoană.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adaugă persoană" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Salariu")).not.toBeInTheDocument();
    expect(screen.queryByText("person_id")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Șterge" })).not.toBeInTheDocument();
  });
});
