import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

function isViteInternalUrl(url: string): boolean {
  const path = url.split("?")[0] ?? url;
  return (
    path.startsWith("/@") ||
    path.startsWith("/src/") ||
    path.startsWith("/node_modules/") ||
    path.startsWith("/api") ||
    path.startsWith("/__") ||
    /\.[a-zA-Z0-9]+$/.test(path)
  );
}

export default defineConfig({
  appType: "mpa",
  plugins: [
    {
      name: "ui20-index",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? "";
          if (!isViteInternalUrl(url)) {
            req.url = "/ui20.html";
          }
          next();
        });
      },
    },
    react(),
  ],
  server: {
    host: "127.0.0.1",
    port: Number(process.env.WORKOS_E2E_UI20_PORT ?? 5179),
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET ?? "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, "ui20.html"),
    },
  },
});
