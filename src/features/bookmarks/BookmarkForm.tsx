'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Link, Tag, FolderOpen } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { createBookmark, addBookmarkOptimistic, removeOptimisticBookmark } from './bookmarksSlice'
import { BOOKMARK_CATEGORIES, type BookmarkCategory } from '../../lib/url-utils'

export const BookmarkForm = () => {
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState<BookmarkCategory | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.bookmarks)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim() || !user) return

    setIsSubmitting(true)

    // Create optimistic bookmark
    const optimisticId = `temp-${Date.now()}`
    dispatch(addBookmarkOptimistic({
      id: optimisticId,
      user_id: user.id,
      url: url.trim(),
      title: 'Loading...',
      summary: 'Processing...',
      favicon: null,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: category || null,
      is_favorite: false,
    }))

    try {
      const result = await dispatch(createBookmark({
        url: url.trim(),
        userId: user.id,
      }))

      if (createBookmark.fulfilled.match(result)) {
        // Update the real bookmark with tags and category if provided
        if (tags || category) {
          // We'll handle updating tags/category after creation
          // For now, just clear the form
        }
        
        // Clear form
        setUrl('')
        setTags('')
        setCategory('')
      } else {
        // Remove optimistic bookmark on error
        dispatch(removeOptimisticBookmark(optimisticId))
      }
    } catch {
      dispatch(removeOptimisticBookmark(optimisticId))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-white/20">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                type="url"
                placeholder="Paste your URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={!url.trim() || isSubmitting}
              className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bookmark
                </>
              )}
            </Button>
          </div>

          {/* Optional metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookmarkCategory | '')}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="">Select category...</option>
                {BOOKMARK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-800 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
