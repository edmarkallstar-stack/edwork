import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: import('@/types').Role[]
  staffOnly?: boolean
}

export function ProtectedRoute({
  children,
  allowedRoles,
  staffOnly,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-edmark-neutral-50">
        <div className="text-edmark-dark-blue font-medium">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  if (staffOnly && user.role !== 'employee') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
