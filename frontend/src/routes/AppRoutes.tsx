import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/auth/LoginPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { RoleSelectionPage } from '../pages/auth/RoleSelectionPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminAllTasksPage } from '../pages/admin/AdminAllTasksPage'
import { UserDashboardPage } from '../pages/user/UserDashboardPage'
import { UserTasksPage } from '../pages/user/UserTasksPage'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { Toaster } from 'react-hot-toast'
import { Layout } from '../components/layout/Layout'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/select-role" element={<RoleSelectionPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <AdminRoute>
                <AdminAllTasksPage />
              </AdminRoute>
            }
          />
          <Route
            path="/user/tasks"
            element={
              <ProtectedRoute>
                <UserTasksPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

