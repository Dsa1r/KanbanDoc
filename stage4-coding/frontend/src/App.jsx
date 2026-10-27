import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LearningPathPage from './pages/LearningPathPage.jsx'
import KanbanPage from './pages/KanbanPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* Redirect /learning-path to /roadmap for backward compatibility */}
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
      <Route
        path="/projects/:projectId/board"
        element={
          <ProtectedRoute>
            <KanbanPage />
          </ProtectedRoute>
        }
      />
     {import.meta.env.DEV && <Route path="/dev/kanban" element={<KanbanPage />} />} 
           {import.meta.env.DEV && <Route path="/dev/dashboard" element={<DashboardPage />} />}   
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}