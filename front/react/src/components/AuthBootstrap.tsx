import { Spin } from 'antd'
import { useEffect, type ReactNode } from 'react'
import { getMeApi } from '../services/authService'
import { logout, setAuthReady, setUserFromMe } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

/**
 * 应用启动时：若本地有 token，请求 GET /api/auth/me 校验并同步用户信息；
 * 失败则清除登录态。在 authReady 之前显示全屏加载，避免路由误判。
 */
export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)
  const authReady = useAppSelector((s) => s.auth.authReady)

  useEffect(() => {
    if (!token) {
      dispatch(setAuthReady(true))
      return
    }

    let cancelled = false

    void (async () => {
      try {
        const user = await getMeApi()
        if (!cancelled) {
          dispatch(setUserFromMe(user))
        }
      } catch {
        if (!cancelled) {
          dispatch(logout())
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
  }, [dispatch, token])

  if (!authReady) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#fafafa',
        }}
      >
        <Spin size="large" tip="正在验证登录…" />
      </div>
    )
  }

  return children
}