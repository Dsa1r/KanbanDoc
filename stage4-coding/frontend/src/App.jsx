import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LearningPathPage from './pages/LearningPathPage.jsx'
import KanbanPage from './pages/KanbanPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
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
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
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
     {import.meta.env.DEV && <Route path="/dev/board" element={<KanbanPage />} />} 
           {import.meta.env.DEV && <Route path="/dev/dashboard" element={<DashboardPage />} />}   
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

{import.meta.env.DEV && (
  <Route
    path="/dev/projects/:projectId/board"
    element={<KanbanPage />}
  />
)}