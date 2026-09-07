import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Ui20App } from "./Ui20App";
import "../tokens/ui20.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root was not found");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Ui20App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
