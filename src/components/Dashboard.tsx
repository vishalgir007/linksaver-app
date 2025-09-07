'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, User, Settings, Bell, Bookmark } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchBookmarks, setSearchQuery, setSelectedCategory, setSortBy } from '../features/bookmarks/bookmarksSlice'
import { BookmarkForm } from '../features/bookmarks/BookmarkForm'
import { BookmarkCard } from '../features/bookmarks/BookmarkCard'
import { BOOKMARK_CATEGORIES } from '../lib/url-utils'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const dispatch = useAppDispatch()
  const { bookmarks, loading, searchQuery, selectedCategory, sortBy, sortOrder } = useAppSelector((state) => state.bookmarks)

  // Load initial bookmarks
  useEffect(() => {
    if (user?.id && !loading) {
      dispatch(fetchBookmarks({ 
        userId: user.id, 
        search: searchQuery, 
        category: selectedCategory, 
        sortBy, 
        sortOrder 
      }))
    }
  }, [dispatch, user?.id, searchQuery, selectedCategory, sortBy, sortOrder, loading])

  // Calculate stats
  const bookmarkCount = bookmarks.filter(bookmark => !bookmark.id.startsWith('temp-')).length
  const categoriesCount = new Set(bookmarks.map(b => b.category).filter(Boolean)).size
  const totalVisits = bookmarks.reduce((sum, bookmark) => {
    // This is a placeholder - in a real app you'd track actual visits
    return sum + (bookmark.id.startsWith('temp-') ? 0 : 1)
  }, 0)

  const stats = [
    { label: 'Links Saved', value: bookmarkCount.toString(), color: 'from-blue-500 to-blue-600' },
    { label: 'Categories', value: categoriesCount.toString(), color: 'from-purple-500 to-purple-600' },
    { label: 'Total Visits', value: totalVisits.toString(), color: 'from-pink-500 to-pink-600' },
    { label: 'Bookmarks', value: bookmarkCount.toString(), color: 'from-green-500 to-green-600' },
  ]

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value))
  }

  const handleCategoryFilter = (category: string | null) => {
    dispatch(setSelectedCategory(category))
  }

  const handleSort = (newSortBy: 'created_at' | 'title' | 'last_accessed') => {
    const newOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc'
    dispatch(setSortBy({ sortBy: newSortBy, sortOrder: newOrder }))
  }

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
                Welcome back, {user?.user_metadata?.username || "User"}!
              </h1>
              <p className="text-white/70">Here&apos;s your dashboard overview</p>
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

        {/* Bookmark Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <BookmarkForm />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
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

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategoryFilter(e.target.value || null)}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm"
                  >
                    <option value="">All Categories</option>
                    {BOOKMARK_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                  
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleSort('created_at')}
                    className="px-3"
                  >
                    Date {sortBy === 'created_at' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                  
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleSort('title')}
                    className="px-3"
                  >
                    Title {sortBy === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookmarks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bookmark className="w-5 h-5 mr-2" />
                Your Bookmarks ({bookmarkCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                    <Bookmark className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-white/70 text-lg mb-2">No bookmarks yet</p>
                  <p className="text-white/50 text-sm">
                    Start by adding your first bookmark above!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bookmarks.map((bookmark) => (
                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
              )}
              
              {loading && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto"
                  />
                  <p className="text-white/70 mt-2">Loading more bookmarks...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* User Info Card - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
