/**
 * 后端 API 根地址，来自环境变量 VITE_API_BASE_URL。
 * - 开发：`.env.development` 留空 → axios 相对路径，由 Vite 代理到本地或 VITE_API_BASE_URL
 * - 生产：`.env.production` 中配置 Railway 等线上地址
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''