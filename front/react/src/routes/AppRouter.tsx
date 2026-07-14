import { Spin } from 'antd'
import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const MenuManagePage = lazy(() => import('../pages/MenuManagePage'))
const OrderListPage = lazy(() => import('../pages/OrderListPage'))

function RouteFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <Spin size="large" />
    </div>
  )
}

function AdminPage({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}

export default function AppRouter() {
  return (
    <BrowserRouter basename="/firstGo">
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AdminPage>
                  <HomePage />
                </AdminPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/manage"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage>
                  <MenuManagePage />
                </AdminPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage>
                  <OrderListPage />
                </AdminPage>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
