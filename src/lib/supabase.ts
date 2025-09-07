import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xlhpsqezvnrxlfwnarrm.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaHBzcWV6dm5yeGxmd25hcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDM0MzAsImV4cCI6MjA3MDA3OTQzMH0.2SAoC5rLo-5EBxFj5G0eTcyDQYihnqe6YsW5F-th-mo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable since we're not using email verification
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'linksaver-app'
    }
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string | null
          summary: string | null
          favicon: string | null
          tags: string[]
          category: string | null
          is_favorite: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          last_accessed: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          title?: string | null
          summary?: string | null
          favicon?: string | null
          tags?: string[]
          category?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          last_accessed?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          title?: string | null
          summary?: string | null
          favicon?: string | null
          tags?: string[]
          category?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          last_accessed?: string
        }
      }
    }
  }
}
