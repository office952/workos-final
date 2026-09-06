import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ObjectContextStrip } from "./ObjectContextStrip";

describe("ObjectContextStrip", () => {
  it("renders nothing without truthful props", () => {
    const { container } = render(<ObjectContextStrip />);
    expect(container).toBeEmptyDOMElement();
  });

  it("formats only provided fields", () => {
    render(
      <ObjectContextStrip
        objectType="Cerere"
        displayId="CRQ-12"
        displayName="Panou exterior"
        returnTarget={{ label: "Cereri", href: "/requests" }}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Context obiect" })).toBeInTheDocument();
    expect(screen.getByText("Cerere")).toBeInTheDocument();
    expect(screen.getByText("CRQ-12")).toBeInTheDocument();
    expect(screen.getByText("Panou exterior")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cereri" })).toHaveAttribute("href", "/requests");
  });
});
