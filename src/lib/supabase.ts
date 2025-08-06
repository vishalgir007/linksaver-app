import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xlhpsqezvnrxlfwnarrm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaHBzcWV6dm5yeGxmd25hcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDM0MzAsImV4cCI6MjA3MDA3OTQzMH0.2SAoC5rLo-5EBxFj5G0eTcyDQYihnqe6YsW5F-th-mo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
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
    }
  }
}
