/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WORKOS_DEV_AUTO_OPERATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
