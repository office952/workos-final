import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { ProductCatalogPage } from "./ProductCatalogPage";
import { ProductConfigurationPage } from "./ProductConfigurationPage";
import { SystemStatusPage } from "./SystemStatusPage";

const NAV_ITEMS = [
  { to: "/", label: "Stare sistem" },
  { to: "/products", label: "Produse" },
];

export function App() {
  return (
    <AppShell navItems={NAV_ITEMS}>
      <Routes>
        <Route path="/" element={<SystemStatusPage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
