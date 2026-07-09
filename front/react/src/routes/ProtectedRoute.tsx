import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../store/hooks'

interface ProtectedRouteProps {
  children: ReactNode
  /** 若提供，还要求当前用户拥有其中任一角色，否则跳转 */
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && roles.length > 0) {
    const hasRole = (user?.roles ?? []).some((r) => roles.includes(r))
    if (!hasRole) {
      return <Navigate to="/menu" replace />
    }
  }

  return children
}
