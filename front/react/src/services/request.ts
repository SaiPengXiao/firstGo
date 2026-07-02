import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL } from '../config/api'

const AUTH_TOKEN_KEY = 'auth_token'

/** 后端错误体 */
interface ApiErrorBody {
  message?: string
}

function getErrorMessage(error: AxiosError<ApiErrorBody>): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response) {
    const status = error.response.status
    if (status === 404) {
      return '接口不存在 (404)：请确认后端已部署该路由并已重启服务'
    }
    return `请求失败（${status}）`
  }
  if (error.request) {
    return '无法连接服务器，请确认后端已启动（默认 http://localhost:8080）'
  }
  return error.message || '网络异常'
}

const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截：自动附带 JWT */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/** 响应拦截：统一错误为 Error，便于页面 message.error */
request.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    return Promise.reject(new Error(getErrorMessage(error)))
  },
)

export default request

/** 便捷 POST，直接返回 data */
export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await request.post<T>(url, data, config)
  return res.data
}

/** 便捷 GET */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await request.get<T>(url, config)
  return res.data
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await request.put<T>(url, data, config)
  return res.data
}

export async function del<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await request.delete<T>(url, config)
  return res.data
}