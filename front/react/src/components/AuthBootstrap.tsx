import { Spin } from 'antd'
import { useEffect, type ReactNode } from 'react'
import { getMeApi } from '../services/authService'
import { logout, setAuthReady, setUserFromMe } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

/**
 * 应用启动鉴权：
 * - 本地有 token：请求 GET /api/auth/me 校验，成功则恢复登录态，失败则清除并保持未登录
 * - 本地无 token：直接标记鉴权完成，进入登录页
 * 不会自动用默认账号登录。
 */
export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const authReady = useAppSelector((s) => s.auth.authReady)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const token = localStorage.getItem('auth_token')

      try {
        if (!token) {
          return
        }

        try {
          const user = await getMeApi()
          // 检查是否为管理员
          const isAdmin = user.roles?.includes('admin')
          if (!isAdmin) {
            if (!cancelled) {
              dispatch(logout())
            }
            return
          }
          if (!cancelled) {
            dispatch(setUserFromMe(user))
          }
        } catch {
          if (!cancelled) {
            dispatch(logout())
          }
        }
      } finally {
        if (!cancelled) {
          dispatch(setAuthReady(true))
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch])

  if (!authReady) {
    return (
      <div className="app-loading-overlay" aria-busy="true" aria-live="polite">
        <Spin size="large" />
        <p style={{ marginTop: 12, color: 'var(--color-text-secondary, #888)' }}>正在校验登录态…</p>
      </div>
    )
  }

  return children
}
