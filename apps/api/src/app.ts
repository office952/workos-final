import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerInventoryRoutes } from "./inventory/routes.js";
import { registerJobRoutes } from "./jobs/routes.js";
import { registerPeopleRoutes } from "./people/routes.js";
import { registerProductRoutes } from "./product.js";
import { registerProductSystemAdminRoutes } from "./productSystem/routes.js";
import {
  createProductSystemRuntime,
  type ProductSystemRuntime,
} from "./productSystem/runtime.js";
import { registerSystemProjectionRoutes } from "./system.js";

export const HEALTH_SERVICE_NAME = "workos-final-api" as const;

export type HealthResponse = {
  status: "ok";
  service: typeof HEALTH_SERVICE_NAME;
};

const DEV_WEB_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
] as const;

export type CreateAppOptions = {
  productSystem?: ProductSystemRuntime;
};

export function createApp(options: CreateAppOptions = {}): Hono {
  const app = new Hono();
  const productSystem = options.productSystem ?? createProductSystemRuntime();

  app.use(
    "/api/*",
    cors({
      origin: [...DEV_WEB_ORIGINS],
    }),
  );

  app.get("/api/health", (c) => {
    const body: HealthResponse = {
      status: "ok",
      service: HEALTH_SERVICE_NAME,
    };
    return c.json(body);
  });

  registerProductRoutes(app, productSystem);
  registerJobRoutes(app, productSystem);
  registerPeopleRoutes(app, productSystem);
  registerInventoryRoutes(app, productSystem);
  registerSystemProjectionRoutes(app, productSystem);
  registerProductSystemAdminRoutes(app, productSystem);

  return app;
}
