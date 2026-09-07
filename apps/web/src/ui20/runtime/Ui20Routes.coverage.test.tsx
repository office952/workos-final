import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Ui20Routes } from "./Ui20Routes";

vi.mock("../../CloudSessionContext", () => ({
  useCloudSession: () => ({ organization: null }),
}));

vi.mock("../surfaces/lucrare/JobsRegistry", () => ({
  JobsRegistry: () => <div data-page="jobs-registry">Jobs registry</div>,
}));
vi.mock("../surfaces/cerere/RequestsRegistry", () => ({
  RequestsRegistry: () => <div data-page="requests-registry">Requests registry</div>,
}));
vi.mock("../surfaces/oferta/QuotesRegistry", () => ({
  QuotesRegistry: () => <div data-page="quotes-registry">Quotes registry</div>,
}));
vi.mock("../surfaces/catalog/CatalogBrowse", () => ({
  CatalogBrowse: () => <div data-page="catalog">Catalog</div>,
}));
vi.mock("../bridges/productPick/ProductPickBridge", () => ({
  ProductPickBridge: () => <div data-page="product-pick">Product pick</div>,
}));
vi.mock("../surfaces/clients/ClientsRegistry", () => ({
  ClientsRegistry: () => <div data-page="clients-registry">Clients</div>,
}));
vi.mock("../surfaces/clients/ClientHub", () => ({
  ClientHub: () => <div data-page="client-hub">Client hub</div>,
}));
vi.mock("../surfaces/cerere/ResolutionField", () => ({
  ResolutionField: () => <div data-page="resolution">Resolution</div>,
}));
vi.mock("../surfaces/configurator/ConstructionWorkspace", () => ({
  ConstructionWorkspace: () => <div data-page="construction">Construction</div>,
}));
vi.mock("../surfaces/oferta/CommercialSheet", () => ({
  CommercialSheet: () => <div data-page="commercial">Commercial</div>,
}));
vi.mock("../surfaces/lucrare/ProductionTraveler", () => ({
  ProductionTraveler: () => <div data-page="traveler">Traveler</div>,
}));
vi.mock("../surfaces/atelier/DispatchFloor", () => ({
  DispatchFloor: () => <div data-page="atelier">Atelier</div>,
}));
vi.mock("../surfaces/execution/Workstation", () => ({
  Workstation: () => <div data-page="workstation">Workstation</div>,
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/*" element={<Ui20Routes />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Ui20Routes coverage expansion", () => {
  afterEach(() => {
    cleanup();
  });

  it("maps / and /jobs to jobs registry", () => {
    renderAt("/");
    expect(screen.getByText("Jobs registry")).toBeInTheDocument();
    cleanup();
    renderAt("/jobs");
    expect(screen.getByText("Jobs registry")).toBeInTheDocument();
  });

  it("maps overview registries and client hub", () => {
    renderAt("/requests");
    expect(screen.getByText("Requests registry")).toBeInTheDocument();
    cleanup();
    renderAt("/quotes");
    expect(screen.getByText("Quotes registry")).toBeInTheDocument();
    cleanup();
    renderAt("/clients");
    expect(screen.getByText("Clients")).toBeInTheDocument();
    cleanup();
    renderAt("/clients/cus:1");
    expect(screen.getByText("Client hub")).toBeInTheDocument();
  });

  it("keeps catalog vs product-pick query fork", async () => {
    renderAt("/products");
    expect(screen.getByText("Catalog")).toBeInTheDocument();
    cleanup();
    renderAt("/products?request=crq:1");
    await waitFor(() => expect(screen.getByText("Product pick")).toBeInTheDocument());
  });

  it("keeps spine object routes", () => {
    renderAt("/requests/crq:1");
    expect(screen.getByText("Resolution")).toBeInTheDocument();
  });
});
