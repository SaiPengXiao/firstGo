import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../store/hooks'

interface GuestRouteProps {
  children: ReactNode
}

/** 已登录用户访问登录/注册页时重定向到首页 */
export default function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return children
}