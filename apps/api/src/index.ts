import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { openProvisionedControlPlane } from "./cloud/provision.js";
import { isCloudRootConfigured, resolveCloudRoot } from "./cloud/paths.js";
import { createRuntimeRegistry } from "./cloud/runtimeRegistry.js";
import { createProductSystemRuntime } from "./productSystem/runtime.js";

const port = Number(process.env.PORT ?? 8787);
const hostname = process.env.HOST ?? "127.0.0.1";

if (isCloudRootConfigured()) {
  const cloudRoot = resolveCloudRoot();
  const controlPlane = openProvisionedControlPlane(cloudRoot);
  const registry = createRuntimeRegistry();
  serve(
    {
      fetch: createApp({ cloud: { controlPlane, registry } }).fetch,
      hostname,
      port,
    },
    (info) => {
      console.log(
        `workos-final-api listening on http://${info.address}:${info.port}`,
      );
      console.log(`workos cloud root: ${cloudRoot}`);
    },
  );
} else {
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
}
