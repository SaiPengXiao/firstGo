/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 根地址，如 https://xxx.up.railway.app */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}