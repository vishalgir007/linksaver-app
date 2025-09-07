'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bookmark, 
  Brain, 
  Zap, 
  Shield, 
  Search, 
  Globe, 
  Sparkles, 
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Bot,
  Rocket,
  BookmarkPlus,
  FileText,
  Tag
} from 'lucide-react'
import { Button } from '../components/ui/button'

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  gradient: string
  delay: number
}

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  index: number
}

interface ProcessCardProps {
  step: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  index: number
}

export const LandingPage = () => {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Summarization",
      description: "Advanced AI instantly extracts key insights from any webpage, saving you hours of reading time.",
      gradient: "from-blue-500 to-indigo-600",
      delay: 0.1
    },
    {
      icon: Zap,
      title: "Lightning Fast Search",
      description: "Find any bookmark instantly with our smart search that understands context and content.",
      gradient: "from-indigo-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: Globe,
      title: "Universal Compatibility",
      description: "Works with any website, any content type. From articles to videos, we've got you covered.",
      gradient: "from-cyan-500 to-blue-500",
      delay: 0.3
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays yours. End-to-end encryption ensures your bookmarks remain completely private.",
      gradient: "from-blue-600 to-slate-600",
      delay: 0.4
    }
  ]

  const stats = [
    { icon: Users, label: "Active Users", value: "10K+", color: "text-blue-300" },
    { icon: Bookmark, label: "Bookmarks Saved", value: "500K+", color: "text-cyan-300" },
    { icon: TrendingUp, label: "Time Saved", value: "2M+ hrs", color: "text-indigo-300" },
    { icon: Bot, label: "AI Accuracy", value: "99.8%", color: "text-blue-200" }
  ]

  const howItWorks = [
    {
      step: "01",
      icon: BookmarkPlus,
      title: "Save Any Link",
      description: "Simply paste any URL and our AI instantly analyzes the content, extracting title, summary, and metadata."
    },
    {
      step: "02",
      icon: Brain,
      title: "AI Processing",
      description: "Advanced machine learning algorithms categorize, tag, and generate intelligent summaries of your content."
    },
    {
      step: "03",
      icon: Search,
      title: "Intelligent Discovery",
      description: "Find exactly what you need with semantic search that understands context and meaning."
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900/50 to-black" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
          }}
        />
        {/* Floating Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-500/20 to-indigo-600/15 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + i * 8}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Bookmark className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                LinkSaver
              </span>
              <div className="text-xs text-blue-300/80">AI-Powered Bookmarks</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Button
              onClick={() => router.push('/auth')}
              variant="outline"
              className="text-blue-200 hover:text-white hover:bg-blue-900/30"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/auth')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 backdrop-blur-md border border-blue-400/30 rounded-xl text-white hover:from-blue-600/30 hover:to-indigo-700/30 transition-all duration-300 flex items-center space-x-2 shadow-xl shadow-blue-500/10"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y, opacity }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-200"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm">Introducing AI-Powered Bookmark Intelligence</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                NeuralLink,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                Discover Insights
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform how you manage information with AI that automatically summarizes, 
              categorizes, and helps you rediscover your saved content with unprecedented intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                onClick={() => router.push('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white font-semibold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center space-x-2 group"
                size="lg"
              >
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start Saving Smarter</span>
              </Button>
              
              <Button
                variant="outline"
                className="px-8 py-4 bg-gradient-to-r from-slate-800/40 to-blue-900/40 backdrop-blur-md border border-blue-400/30 rounded-xl text-blue-100 font-semibold text-lg hover:from-slate-800/60 hover:to-blue-900/60 transition-all duration-300 flex items-center space-x-2"
                size="lg"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Button>
            </div>

            {/* Preview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 flex justify-center"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-900/60 to-blue-950/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 max-w-md mx-auto shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-blue-300/40 rounded mb-1"></div>
                      <div className="h-2 bg-blue-200/30 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-2 bg-blue-200/30 rounded"></div>
                    <div className="h-2 bg-blue-200/30 rounded w-4/5"></div>
                    <div className="h-2 bg-blue-200/30 rounded w-3/5"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 bg-blue-500/50 rounded-full"></div>
                      <div className="w-4 h-4 bg-indigo-500/50 rounded-full"></div>
                      <div className="w-4 h-4 bg-cyan-500/50 rounded-full"></div>
                    </div>
                    <div className="text-xs text-blue-200/80">AI Summarized</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl"
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-xl"
                >
                  <Tag className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
              Experience the future of bookmark management with cutting-edge AI technology
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-blue-200/80">Simple steps to transform your bookmarking experience</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <ProcessCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-900/60 to-blue-950/60 backdrop-blur-xl border border-blue-400/40 rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Ready to Transform Your Bookmarks?
            </h2>
            <p className="text-xl text-blue-200/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who&apos;ve revolutionized how they save and discover online content with AI.
            </p>
            <Button
              onClick={() => router.push('/auth')}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white font-bold text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group"
              size="lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-blue-500/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LinkSaver</span>
          </div>
          <p className="text-blue-300/70">
            Built with ❤️ using Next.js, AI, and modern web technologies
          </p>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, gradient, delay }: FeatureCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <div className="relative p-8 bg-gradient-to-br from-slate-900/40 to-blue-950/40 backdrop-blur-xl border border-blue-400/30 rounded-2xl hover:from-slate-900/60 hover:to-blue-950/60 transition-all duration-500 overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-blue-200/80 leading-relaxed">{description}</p>
        
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  )
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color, index }: StatsCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-slate-900/40 to-blue-950/40 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 hover:from-slate-900/60 hover:to-blue-950/60 transition-all duration-300 shadow-xl">
        <Icon className={`w-8 h-8 ${color} mx-auto mb-4`} />
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        <div className="text-blue-300/70 text-sm">{label}</div>
      </div>
    </motion.div>
  )
}

// Process Card Component
function ProcessCard({ step, icon: Icon, title, description, index }: ProcessCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="text-center group"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl">
          {step}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-blue-200/80 leading-relaxed">{description}</p>
    </motion.div>
  )
}
