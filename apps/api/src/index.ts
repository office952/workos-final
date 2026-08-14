import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { createProductSystemRuntime } from "./productSystem/runtime.js";

const port = Number(process.env.PORT ?? 8787);
const hostname = process.env.HOST ?? "127.0.0.1";
const productSystem = createProductSystemRuntime();

serve(
  { fetch: createApp({ productSystem }).fetch, hostname, port },
  (info) => {
    console.log(
      `workos-final-api listening on http://${info.address}:${info.port}`,
    );
    console.log(`product-system sqlite: ${productSystem.sqlitePath}`);
  },
);
