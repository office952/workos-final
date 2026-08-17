import { Navigate, Route, Routes } from "react-router-dom";
import { AdminHomePage } from "./AdminHomePage";
import { AppShell } from "./AppShell";
import { AtelierPage } from "./AtelierPage";
import { ComponentsPage } from "./ComponentsPage";
import { ExecutionWorkspacePage } from "./ExecutionWorkspacePage";
import { GovernancePage } from "./GovernancePage";
import { ClientsOverviewPage } from "./ClientsOverviewPage";
import { ClientWorkspacePage } from "./ClientWorkspacePage";
import { JobsOverviewPage } from "./JobsOverviewPage";
import { QuotesOverviewPage } from "./QuotesOverviewPage";
import { RequestDetailPage } from "./RequestDetailPage";
import { RequestsOverviewPage } from "./RequestsOverviewPage";
import { CustomerAdminPage } from "./CustomerAdminPage";
import { SellerAdminPage } from "./SellerAdminPage";
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
import { OperatorSessionProvider } from "./OperatorSessionContext";

const NAV_ITEMS = [
  { to: "/", label: "Lucrări" },
  { to: "/atelier", label: "Atelier" },
  {
    to: "/requests",
    label: "Comercial",
    matchPrefixes: ["/requests", "/quotes", "/clients"],
  },
  { to: "/products", label: "Produse" },
  { to: "/admin", label: "Administrare" },
];

export function App() {
  return (
    <OperatorSessionProvider>
      <AppShell navItems={NAV_ITEMS}>
        <Routes>
          <Route path="/" element={<JobsOverviewPage />} />
          <Route path="/atelier" element={<AtelierPage />} />
          <Route path="/requests" element={<RequestsOverviewPage />} />
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
          <Route path="/quotes" element={<QuotesOverviewPage />} />
          <Route path="/clients" element={<ClientsOverviewPage />} />
          <Route path="/clients/:customerId" element={<ClientWorkspacePage />} />
          <Route path="/system" element={<SystemStatusPage />} />
          <Route path="/products" element={<ProductCatalogPage />} />
          <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
          <Route path="/execution/:planId" element={<ExecutionWorkspacePage />} />
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
          <Route path="/admin/people/:personId" element={<PersonAdminPage />} />
          <Route path="/admin/customers" element={<CustomerAdminPage />} />
          <Route path="/admin/seller" element={<SellerAdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </OperatorSessionProvider>
  );
}
