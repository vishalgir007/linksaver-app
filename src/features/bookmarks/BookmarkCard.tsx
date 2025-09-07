'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Heart, Trash2, Tag, Calendar } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useAppDispatch } from '../../hooks/redux'
import { deleteBookmark, updateBookmark, updateLastAccessed } from './bookmarksSlice'
import { extractDomain } from '../../lib/url-utils'
import type { Bookmark } from './bookmarksSlice'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const [showActions, setShowActions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const dispatch = useAppDispatch()

  const handleVisit = async () => {
    // Update last accessed
    dispatch(updateLastAccessed(bookmark.id))
    
    // Open in new tab
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  const handleToggleFavorite = async () => {
    dispatch(updateBookmark({
      id: bookmark.id,
      updates: { is_favorite: !bookmark.is_favorite }
    }))
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await dispatch(deleteBookmark(bookmark.id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const domain = extractDomain(bookmark.url)
  const isOptimistic = bookmark.id.startsWith('temp-')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group ${
          isOptimistic ? 'opacity-70' : ''
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header with favicon and actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {bookmark.favicon && !isOptimistic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bookmark.favicon}
                  alt={`${domain} favicon`}
                  className="w-6 h-6 rounded-sm flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {domain.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="min-w-0 flex-1">
                <p className="text-white/70 text-xs truncate">{domain}</p>
              </div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showActions ? 1 : 0 }}
              className="flex items-center space-x-1"
            >
              <Button
                variant="glass"
                size="sm"
                onClick={handleToggleFavorite}
                className="p-1 h-6 w-6"
                disabled={isOptimistic}
              >
                <Heart
                  className={`w-3 h-3 ${
                    bookmark.is_favorite ? 'fill-red-500 text-red-500' : 'text-white/50'
                  }`}
                />
              </Button>
              
              <Button
                variant="glass"
                size="sm"
                onClick={handleDelete}
                className="p-1 h-6 w-6 hover:bg-red-500/20"
                disabled={isOptimistic || isDeleting}
              >
                <Trash2 className="w-3 h-3 text-white/50" />
              </Button>
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-white font-medium text-sm leading-tight mb-2 line-clamp-2">
            {bookmark.title || 'Untitled'}
          </h3>

          {/* Summary */}
          {bookmark.summary && (
            <p className="text-white/60 text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
              {bookmark.summary}
            </p>
          )}

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {bookmark.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={`${bookmark.id}-tag-${index}-${tag}`}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200 border border-blue-500/30"
                >
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </span>
              ))}
              {bookmark.tags.length > 3 && (
                <span className="text-white/40 text-xs">+{bookmark.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Category */}
          {bookmark.category && (
            <div className="flex items-center mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-200 border border-purple-500/30">
                {bookmark.category}
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-white/40 mt-auto pt-2 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(bookmark.created_at)}</span>
            </div>
            
            <Button
              variant="glass"
              size="sm"
              onClick={handleVisit}
              className="text-xs px-2 py-1 h-6 hover:bg-blue-500/20"
              disabled={isOptimistic}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Visit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
