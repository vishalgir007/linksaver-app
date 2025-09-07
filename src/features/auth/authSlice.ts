import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  needsVerification: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
  needsVerification: false,
}

// Check if email already exists using the auth admin API
export const checkEmailExists = createAsyncThunk(
  'auth/checkEmailExists',
  async (email: string) => {
    try {
      // First try to check via the profiles table if it exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1)

      if (!profileError && profiles && profiles.length > 0) {
        return { emailExists: true }
      }

      // Fallback: Try a sign-in attempt with a known invalid password
      // This will tell us if the email exists in auth.users
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'intentionally-wrong-password-for-checking-existence',
      })

      // If we get "Invalid login credentials", the email exists
      if (error?.message?.includes('Invalid login credentials')) {
        return { emailExists: true }
      }

      // Any other error likely means email doesn't exist
      return { emailExists: false }
    } catch {
      // If there's an error in the check, proceed with signup attempt
      return { emailExists: false }
    }
  }
)

// Async thunks for authentication actions
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, username }: { email: string; password: string; username: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting signup with:', { email, username })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: undefined // Disable email confirmation
        }
      })

      if (error) {
        console.log('Signup error:', error.message, error)
        
        // Handle specific error cases
        if (error.message?.includes('User already registered')) {
          throw new Error('This email address is already registered. Please sign in instead.')
        }
        if (error.message?.includes('already been registered')) {
          throw new Error('This email address is already registered. Please sign in instead.')
        }
        if (error.message?.includes('email address not authorized')) {
          throw new Error('This email address is not authorized to sign up.')
        }
        if (error.message?.includes('For security purposes, you can only request this after')) {
          throw new Error('Too many signup attempts. Please wait a moment before trying again.')
        }
        if (error.message?.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a few seconds before trying again.')
        }
        if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
        }
        throw error
      }

      console.log('Signup data:', data)

      // Return user directly without email verification requirement
      return {
        user: data.user,
        needsVerification: false // Always false since we're not requiring email verification
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      console.error('Signup error caught:', message)
      return rejectWithValue(message)
    }
  }
)

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting sign in with:', { email })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('Sign in error:', error.message, error)
        
        // Handle specific error cases
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }
        if (error.message?.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.')
        }
        if (error.message?.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment before trying again.')
        }
        if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
        }
        throw error
      }

      console.log('Sign in successful for user:', data.user?.id)
      return data.user
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return null
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    try {
      console.log('Initializing auth...')
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Auth initialization error:', error)
        throw error
      }
      console.log('Auth initialized:', session?.user?.id || 'No user')
      return session?.user || null
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      throw error
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.needsVerification = false
    },
    setNeedsVerification: (state, action: PayloadAction<boolean>) => {
      state.needsVerification = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.isInitialized = true
        state.loading = false
        state.needsVerification = false
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false
        state.isInitialized = true // Still mark as initialized even if failed
        state.error = 'Failed to initialize authentication'
        console.error('Auth initialization failed:', action.error)
      })
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.user) {
          state.user = action.payload.user
          state.isAuthenticated = true // Always authenticate immediately since we removed email verification
          state.needsVerification = false // Always false
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.needsVerification = false
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.needsVerification = false
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setError, setUser, setNeedsVerification } = authSlice.actions
export default authSlice.reducer
