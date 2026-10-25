import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LearningPathPage from './pages/LearningPathPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// كل صفحة = ملف داخل pages/ ، وهنا نربط كل صفحة بمسارها (Route)
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* UI فقط حالياً: مفتوحة بدون تسجيل دخول. لاحقاً لفّوها بـ ProtectedRoute */}
      <Route path="/roadmap" element={<LearningPathPage />} />
      <Route path="/learning-path" element={<Navigate to="/roadmap" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}