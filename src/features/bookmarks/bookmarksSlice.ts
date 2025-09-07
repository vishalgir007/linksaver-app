import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/supabase'

// Types
export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
export type NewBookmark = Database['public']['Tables']['bookmarks']['Insert']
export type UpdateBookmark = Database['public']['Tables']['bookmarks']['Update']

// Utility function to ensure unique bookmarks
const ensureUniqueBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  const seen = new Set<string>()
  return bookmarks.filter(bookmark => {
    if (seen.has(bookmark.id)) {
      console.warn('Duplicate bookmark ID found and filtered:', bookmark.id)
      return false
    }
    seen.add(bookmark.id)
    return true
  })
}

export interface BookmarksState {
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  searchQuery: string
  selectedCategory: string | null
  sortBy: 'created_at' | 'title' | 'last_accessed'
  sortOrder: 'asc' | 'desc'
}

const initialState: BookmarksState = {
  bookmarks: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'created_at',
  sortOrder: 'desc',
}

// Async thunks
export const createBookmark = createAsyncThunk(
  'bookmarks/create',
  async ({ url, userId }: { url: string; userId: string }, { rejectWithValue }) => {
    try {
      // First, get content from our API
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process URL')
      }

      // Create bookmark in database
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          url: result.data.url,
          title: result.data.title,
          summary: result.data.summary,
          favicon: result.data.favicon,
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetch',
  async (
    { 
      userId, 
      page = 0, 
      limit = 20, 
      search = '', 
      category = null, 
      sortBy = 'created_at', 
      sortOrder = 'desc' 
    }: {
      userId: string
      page?: number
      limit?: number
      search?: string
      category?: string | null
      sortBy?: 'created_at' | 'title' | 'last_accessed'
      sortOrder?: 'asc' | 'desc'
    },
    { rejectWithValue }
  ) => {
    try {
      let query = supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(page * limit, (page + 1) * limit - 1)

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,url.ilike.%${search}%`)
      }

      // Apply category filter
      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error

      return { bookmarks: data || [], hasMore: (data || []).length === limit }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const updateBookmark = createAsyncThunk(
  'bookmarks/update',
  async ({ id, updates }: { id: string; updates: UpdateBookmark }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const deleteBookmark = createAsyncThunk(
  'bookmarks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      // Soft delete
      const { error } = await supabase
        .from('bookmarks')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      return id
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const updateLastAccessed = createAsyncThunk(
  'bookmarks/updateLastAccessed',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      return id
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

// Slice
const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentPage = 0
      state.bookmarks = []
      state.hasMore = true
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
      state.currentPage = 0
      state.bookmarks = []
      state.hasMore = true
    },
    setSortBy: (state, action: PayloadAction<{ sortBy: 'created_at' | 'title' | 'last_accessed'; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
      state.currentPage = 0
      state.bookmarks = []
      state.hasMore = true
    },
    resetBookmarks: (state) => {
      state.bookmarks = []
      state.currentPage = 0
      state.hasMore = true
      state.error = null
    },
    // Optimistic update for bookmark creation
    addBookmarkOptimistic: (state, action: PayloadAction<Partial<Bookmark>>) => {
      const optimisticBookmark: Bookmark = {
        id: `temp-${Date.now()}`,
        user_id: action.payload.user_id || '',
        url: action.payload.url || '',
        title: action.payload.title || 'Loading...',
        summary: action.payload.summary || 'Processing...',
        favicon: action.payload.favicon || null,
        tags: action.payload.tags || [],
        category: action.payload.category || null,
        is_favorite: action.payload.is_favorite || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        last_accessed: new Date().toISOString(),
      }
      state.bookmarks.unshift(optimisticBookmark)
    },
    removeOptimisticBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Create bookmark
      .addCase(createBookmark.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBookmark.fulfilled, (state, action) => {
        state.loading = false
        // Remove optimistic bookmark and add real one
        state.bookmarks = state.bookmarks.filter(bookmark => !bookmark.id.startsWith('temp-'))
        
        // Check if bookmark already exists to prevent duplicates
        const existingIndex = state.bookmarks.findIndex(b => b.id === action.payload.id)
        if (existingIndex === -1) {
          state.bookmarks.unshift(action.payload)
        } else {
          // Replace existing bookmark
          state.bookmarks[existingIndex] = action.payload
        }
      })
      .addCase(createBookmark.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // Remove optimistic bookmark on error
        state.bookmarks = state.bookmarks.filter(bookmark => !bookmark.id.startsWith('temp-'))
      })
      
      // Fetch bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false
        const { bookmarks, hasMore } = action.payload
        
        // Ensure bookmarks from API are unique
        const uniqueBookmarks = ensureUniqueBookmarks(bookmarks)
        
        if (state.currentPage === 0) {
          // First page - replace all bookmarks
          state.bookmarks = uniqueBookmarks
        } else {
          // Subsequent pages - filter out any duplicates before adding new bookmarks
          const existingIds = new Set(state.bookmarks.map(b => b.id))
          const newBookmarks = uniqueBookmarks.filter(b => !existingIds.has(b.id))
          
          // Log if duplicates were found (for debugging)
          if (newBookmarks.length !== uniqueBookmarks.length) {
            console.warn('Duplicate bookmarks filtered out:', uniqueBookmarks.length - newBookmarks.length)
          }
          
          state.bookmarks.push(...newBookmarks)
        }
        
        state.hasMore = hasMore
        state.currentPage += 1
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update bookmark
      .addCase(updateBookmark.fulfilled, (state, action) => {
        const index = state.bookmarks.findIndex(bookmark => bookmark.id === action.payload.id)
        if (index !== -1) {
          state.bookmarks[index] = action.payload
        }
      })
      .addCase(updateBookmark.rejected, (state, action) => {
        state.error = action.payload as string
      })
      
      // Delete bookmark
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.payload)
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const {
  clearError,
  setError,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  resetBookmarks,
  addBookmarkOptimistic,
  removeOptimisticBookmark,
} = bookmarksSlice.actions

export default bookmarksSlice.reducer
