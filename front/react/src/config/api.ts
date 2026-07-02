/**
 * 后端 API 根地址
 * - 开发：默认 http://localhost:8080（可用 .env.local 覆盖）
 * - 生产：`.env.production` 中的 VITE_API_BASE_URL
 */
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim()
  const fromEnv = raw ? raw.replace(/\/$/, '') : ''

  if (import.meta.env.DEV) {
    return fromEnv || 'http://localhost:8080'
  }

  return fromEnv
}

export const API_BASE_URL = resolveApiBaseUrl()