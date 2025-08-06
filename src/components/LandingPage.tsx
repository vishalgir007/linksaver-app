'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useRouter } from 'next/navigation'

export const LandingPage = () => {
  const router = useRouter()

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Enterprise-grade security with OTP verification"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with modern architecture"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your dashboard from anywhere in the world"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-16"
        >
          <div className="text-2xl font-bold text-white">LinkSaver</div>
          <Button
            onClick={() => router.push('/auth')}
            variant="glass"
            className="px-6"
          >
            Sign In
          </Button>
        </motion.nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Welcome to the
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Future
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/70 mb-10 max-w-2xl mx-auto"
          >
            Experience next-generation authentication with beautiful 3D interfaces and glassmorphism design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => router.push('/auth')}
              className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="glass"
              className="px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-purple-500/10 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-pink-500/10 rounded-full animate-bounce animation-delay-2000"></div>
      </div>
    </div>
  )
}
