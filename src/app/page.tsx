'use client'

import { useAuth } from '../hooks/useAuth'
import { LandingPage } from '../components/LandingPage'
import { Dashboard } from '../components/Dashboard'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Home() {
  const { isAuthenticated, isInitialized } = useAuth()
  const [showFallback, setShowFallback] = useState(false)

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialized) {
        console.warn('Auth initialization timeout - showing app anyway')
        setShowFallback(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timer)
  }, [isInitialized])

  if (!isInitialized && !showFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white/70 text-sm">Initializing app...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />
}
