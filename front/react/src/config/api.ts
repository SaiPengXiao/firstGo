/** 后端地址；开发环境留空可走 Vite 代理，生产可设 VITE_API_BASE_URL */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  ''