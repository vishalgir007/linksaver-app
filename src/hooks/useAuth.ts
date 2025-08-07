import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initializeAuth, setUser, signOut } from '../features/auth/authSlice'
import { supabase } from '../lib/supabase'
import { useAppDispatch, useAppSelector } from './redux'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, loading, error, isAuthenticated, isInitialized, needsVerification } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    // Initialize auth state on app start
    dispatch(initializeAuth())

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        dispatch(setUser(session?.user || null))
      } else if (event === 'SIGNED_OUT') {
        dispatch(setUser(null))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  const logout = async () => {
    await dispatch(signOut())
    router.push('/')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isInitialized,
    needsVerification,
    logout,
  }
}

export const useAuthRedirect = () => {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, isInitialized, router])

  return { isAuthenticated, isInitialized }
}
