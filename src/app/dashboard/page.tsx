'use client'

import { ProtectedRoute } from '../../components/ProtectedRoute'
import { Dashboard } from '../../components/Dashboard'
import { useAuthRedirect } from '../../hooks/useAuth'

export default function DashboardPage() {
  useAuthRedirect()
  
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
