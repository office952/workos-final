import { Navigate, Route, Routes } from "react-router-dom";
import { AdminHomePage } from "./AdminHomePage";
import { AppShell } from "./AppShell";
import { AtelierPage } from "./AtelierPage";
import { ComponentsPage } from "./ComponentsPage";
import { ExecutionWorkspacePage } from "./ExecutionWorkspacePage";
import { GovernancePage } from "./GovernancePage";
import { ClientsOverviewPage } from "./ClientsOverviewPage";
import { ClientWorkspacePage } from "./ClientWorkspacePage";
import { JobDetailPage } from "./JobDetailPage";
import { JobsOverviewPage } from "./JobsOverviewPage";
import { QuoteInspectionPage } from "./QuoteInspectionPage";
import { QuotesOverviewPage } from "./QuotesOverviewPage";
import { RequestDetailPage } from "./RequestDetailPage";
import { RequestsOverviewPage } from "./RequestsOverviewPage";
import { CustomerAdminPage } from "./CustomerAdminPage";
import { SellerAdminPage } from "./SellerAdminPage";
import { OperationalServicesAdminPage } from "./OperationalServicesAdminPage";
import { PeopleAdminPage } from "./PeopleAdminPage";
import { PersonAdminPage } from "./PersonAdminPage";
import { SkillsAdminPage } from "./SkillsAdminPage";
import { ProductCatalogPage } from "./ProductCatalogPage";
import { ProductConfigurationPage } from "./ProductConfigurationPage";
import { ProcessesAdminPage } from "./ProcessesAdminPage";
import { ProductSystemAdminPage } from "./ProductSystemAdminPage";
import { ResourcesAdminPage } from "./ResourcesAdminPage";
import { StockAdminPage } from "./StockAdminPage";
import { SystemStatusPage } from "./SystemStatusPage";
import { WorkcentersAdminPage } from "./WorkcentersAdminPage";
import { useCloudSession } from "./CloudSessionContext";
import { SessionedApp } from "./runtime/SessionedApp";

export function App() {
  return (
    <SessionedApp>
      <CurrentRuntimeRoutes />
    </SessionedApp>
  );
}

function CurrentRuntimeRoutes() {
  const { organization } = useCloudSession();
  return (
    <AppShell>
      <Routes key={organization?.organizationId ?? "single-plane"}>
        <Route path="/" element={<JobsOverviewPage />} />
        <Route path="/jobs" element={<JobsOverviewPage />} />
        <Route path="/jobs/*" element={<JobDetailPage />} />
        <Route path="/atelier" element={<AtelierPage />} />
        <Route path="/commercial" element={<Navigate to="/requests" replace />} />
        <Route path="/requests" element={<RequestsOverviewPage />} />
        <Route path="/requests/*" element={<RequestDetailPage />} />
        <Route path="/quotes" element={<QuotesOverviewPage />} />
        <Route path="/quotes/*" element={<QuoteInspectionPage />} />
        <Route path="/clients" element={<ClientsOverviewPage />} />
        <Route path="/clients/*" element={<ClientWorkspacePage />} />
        <Route path="/system" element={<SystemStatusPage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        <Route path="/execution/*" element={<ExecutionWorkspacePage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/product-system" element={<ProductSystemAdminPage />} />
        <Route path="/admin/resources" element={<ResourcesAdminPage />} />
        <Route path="/admin/stock" element={<StockAdminPage />} />
        <Route path="/admin/stock/:resourceId" element={<StockAdminPage />} />
        <Route path="/admin/processes" element={<ProcessesAdminPage />} />
        <Route path="/admin/workcenters" element={<WorkcentersAdminPage />} />
        <Route path="/admin/people" element={<PeopleAdminPage />} />
        <Route path="/admin/people/skills" element={<SkillsAdminPage />} />
        <Route path="/admin/people/*" element={<PersonAdminPage />} />
        <Route path="/admin/customers" element={<CustomerAdminPage />} />
        <Route path="/admin/seller" element={<SellerAdminPage />} />
        <Route path="/admin/operational-services" element={<OperationalServicesAdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
