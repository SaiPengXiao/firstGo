import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const MenuOrderPage = lazy(() => import('../pages/MenuOrderPage'))
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
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/manage"
            element={
              <ProtectedRoute roles={['admin']}>
                <MenuManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['admin']}>
                <OrderListPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
