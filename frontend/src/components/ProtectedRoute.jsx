import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

export default function ProtectedRoute({ children }) {
  const auth = useAuth()

  if (auth.loading) {
    return <p className="empty-state">Checking authentication...</p>
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />
  }

  return children
}
