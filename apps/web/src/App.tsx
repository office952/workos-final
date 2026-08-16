import { Navigate, Route, Routes } from "react-router-dom";
import { AdminHomePage } from "./AdminHomePage";
import { AppShell } from "./AppShell";
import { ComponentsPage } from "./ComponentsPage";
import { GovernancePage } from "./GovernancePage";
import { PeopleAdminPage } from "./PeopleAdminPage";
import { ProductCatalogPage } from "./ProductCatalogPage";
import { ProductConfigurationPage } from "./ProductConfigurationPage";
import { ProcessesAdminPage } from "./ProcessesAdminPage";
import { ProductSystemAdminPage } from "./ProductSystemAdminPage";
import { ResourcesAdminPage } from "./ResourcesAdminPage";
import { SystemStatusPage } from "./SystemStatusPage";
import { WorkcentersAdminPage } from "./WorkcentersAdminPage";

const NAV_ITEMS = [
  { to: "/products", label: "Produse" },
  { to: "/admin", label: "Administrare" },
];

export function App() {
  return (
    <AppShell navItems={NAV_ITEMS}>
      <Routes>
        <Route path="/" element={<SystemStatusPage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/product-system" element={<ProductSystemAdminPage />} />
        <Route path="/admin/resources" element={<ResourcesAdminPage />} />
        <Route path="/admin/processes" element={<ProcessesAdminPage />} />
        <Route path="/admin/workcenters" element={<WorkcentersAdminPage />} />
        <Route path="/admin/people" element={<PeopleAdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
