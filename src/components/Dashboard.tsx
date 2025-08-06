'use client'

import { motion } from 'framer-motion'
import { LogOut, User, Settings, Bell } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../hooks/useAuth'

export const Dashboard = () => {
  const { user, logout } = useAuth()

  const stats = [
    { label: 'Links Saved', value: '0', color: 'from-blue-500 to-blue-600' },
    { label: 'Categories', value: '0', color: 'from-purple-500 to-purple-600' },
    { label: 'Total Visits', value: '0', color: 'from-pink-500 to-pink-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.user_metadata?.username || 'User'}!
              </h1>
              <p className="text-white/70">Here's your dashboard overview</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="glass" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="glass" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              onClick={logout}
              variant="glass" 
              size="sm"
              className="text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                🎉 Account Successfully Created!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Your account has been verified and you're now logged in. Start exploring the features and customize your experience.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-white/70">No recent activity yet</p>
                  <p className="text-white/50 text-sm mt-2">Start using the app to see your activity here</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="glass" className="w-full justify-start">
                  <span className="mr-3">📎</span>
                  Add New Link
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <span className="mr-3">📁</span>
                  Create Category
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <span className="mr-3">📊</span>
                  View Analytics
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <span className="mr-3">⚙️</span>
                  Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm">Email</label>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Username</label>
                  <p className="text-white font-medium">{user?.user_metadata?.username || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Account Created</label>
                  <p className="text-white font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
