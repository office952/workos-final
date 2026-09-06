import { Navigate, Route, Routes } from "react-router-dom";
import { useCloudSession } from "../../CloudSessionContext";
import { ProductPickBridge } from "../bridges/productPick/ProductPickBridge";
import { PreviewRoot } from "../shell/PreviewRoot";
import { DispatchFloor } from "../surfaces/atelier/DispatchFloor";
import { ResolutionField } from "../surfaces/cerere/ResolutionField";
import { ConstructionWorkspace } from "../surfaces/configurator/ConstructionWorkspace";
import { Workstation } from "../surfaces/execution/Workstation";
import { JobsLaunch } from "../surfaces/lucrare/JobsLaunch";
import { ProductionTraveler } from "../surfaces/lucrare/ProductionTraveler";
import { CommercialSheet } from "../surfaces/oferta/CommercialSheet";

export function Ui20Routes() {
  const { organization } = useCloudSession();
  return (
    <Routes key={organization?.organizationId ?? "single-plane"}>
      <Route path="/" element={<PreviewRoot />} />
      <Route path="/jobs" element={<JobsLaunch />} />
      <Route path="/jobs/*" element={<ProductionTraveler />} />
      <Route path="/requests/*" element={<ResolutionField />} />
      <Route path="/products" element={<ProductPickBridge />} />
      <Route path="/products/:productCode" element={<ConstructionWorkspace />} />
      <Route path="/quotes/*" element={<CommercialSheet />} />
      <Route path="/atelier" element={<DispatchFloor />} />
      <Route path="/execution/*" element={<Workstation />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
