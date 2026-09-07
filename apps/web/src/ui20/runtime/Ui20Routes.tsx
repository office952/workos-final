import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { useCloudSession } from "../../CloudSessionContext";
import { ProductPickBridge } from "../bridges/productPick/ProductPickBridge";
import { CatalogBrowse } from "../surfaces/catalog/CatalogBrowse";
import { DispatchFloor } from "../surfaces/atelier/DispatchFloor";
import { RequestsRegistry } from "../surfaces/cerere/RequestsRegistry";
import { ResolutionField } from "../surfaces/cerere/ResolutionField";
import { ClientHub } from "../surfaces/clients/ClientHub";
import { ClientsRegistry } from "../surfaces/clients/ClientsRegistry";
import { ConstructionWorkspace } from "../surfaces/configurator/ConstructionWorkspace";
import { Workstation } from "../surfaces/execution/Workstation";
import { JobsRegistry } from "../surfaces/lucrare/JobsRegistry";
import { ProductionTraveler } from "../surfaces/lucrare/ProductionTraveler";
import { CommercialSheet } from "../surfaces/oferta/CommercialSheet";
import { QuotesRegistry } from "../surfaces/oferta/QuotesRegistry";

function ProductsIndexRoute() {
  const [searchParams] = useSearchParams();
  if (searchParams.get("request")) {
    return <ProductPickBridge />;
  }
  return <CatalogBrowse />;
}

export function Ui20Routes() {
  const { organization } = useCloudSession();
  return (
    <Routes key={organization?.organizationId ?? "single-plane"}>
      <Route path="/" element={<JobsRegistry />} />
      <Route path="/jobs" element={<JobsRegistry />} />
      <Route path="/jobs/*" element={<ProductionTraveler />} />
      <Route path="/requests" element={<RequestsRegistry />} />
      <Route path="/requests/*" element={<ResolutionField />} />
      <Route path="/products" element={<ProductsIndexRoute />} />
      <Route path="/products/:productCode" element={<ConstructionWorkspace />} />
      <Route path="/quotes" element={<QuotesRegistry />} />
      <Route path="/quotes/*" element={<CommercialSheet />} />
      <Route path="/clients" element={<ClientsRegistry />} />
      <Route path="/clients/*" element={<ClientHub />} />
      <Route path="/atelier" element={<DispatchFloor />} />
      <Route path="/execution/*" element={<Workstation />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
