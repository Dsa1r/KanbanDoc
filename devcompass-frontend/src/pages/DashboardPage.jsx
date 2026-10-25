import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// صفحة مؤقتة — تستبدلونها بصفحة المشاريع الحقيقية
export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/auth')
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}