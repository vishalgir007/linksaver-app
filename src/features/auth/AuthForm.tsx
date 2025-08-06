'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { signIn, signUp, verifyOtp, clearError } from './authSlice'
import { validatePassword } from '../../lib/utils'

type AuthMode = 'signin' | 'signup' | 'verify'

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    otp: ''
  })

  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    if (mode === 'signin') {
      dispatch(signIn({ email: formData.email, password: formData.password }))
    } else if (mode === 'signup') {
      if (!validatePassword(formData.password)) {
        return
      }
      const result = await dispatch(signUp({ 
        email: formData.email, 
        password: formData.password, 
        username: formData.username 
      }))
      if (signUp.fulfilled.match(result)) {
        setMode('verify')
      }
    } else if (mode === 'verify') {
      dispatch(verifyOtp({ email: formData.email, token: formData.otp }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    dispatch(clearError())
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Sign in to your account to continue' 
                : mode === 'signup' 
                ? 'Create a new account to get started'
                : 'Enter the OTP sent to your email'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {mode !== 'verify' && (
                <motion.div
                  key="auth-tabs"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex rounded-xl bg-white/5 p-1 backdrop-blur-sm"
                >
                  <button
                    onClick={() => switchMode('signin')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                      mode === 'signin'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => switchMode('signup')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                      mode === 'signup'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Sign Up
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'verify' ? (
                  <motion.div
                    key="otp-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        className="pl-12"
                        required
                        maxLength={6}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="relative"
                      >
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Username"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="pl-12"
                          required
                        />
                      </motion.div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-12"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {mode === 'signup' && formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-white/60"
                      >
                        Password must be at least 6 characters with numbers and special characters
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Verify'
                )}
              </Button>

              {mode === 'verify' && (
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => setMode('signup')}
                  className="w-full"
                >
                  Back to Sign Up
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
