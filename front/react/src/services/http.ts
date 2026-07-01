import { API_BASE_URL } from '../config/api'

interface ApiErrorBody {
  message?: string
}

export async function apiPost<TResponse>(
  path: string,
  body: unknown,
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`
  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('无法连接服务器，请确认后端已启动（默认 http://localhost:8080）')
  }

  const data = (await response.json().catch(() => ({}))) as
    | TResponse
    | ApiErrorBody

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as ApiErrorBody).message === 'string'
        ? (data as ApiErrorBody).message
        : `请求失败（${response.status}）`
    throw new Error(message)
  }

  return data as TResponse
}