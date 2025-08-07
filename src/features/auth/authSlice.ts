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

// Check if email already exists
export const checkEmailExists = createAsyncThunk(
  'auth/checkEmailExists',
  async (email: string, { rejectWithValue }) => {
    try {
      // Try to sign in with a dummy password to check if email exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-check',
      })

      // If error is "Invalid login credentials", email exists but password is wrong
      if (error?.message?.includes('Invalid login credentials')) {
        return { emailExists: true }
      }
      
      // If error is something else, email probably doesn't exist
      return { emailExists: false }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

// Async thunks for authentication actions
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, username }: { email: string; password: string; username: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      })

      if (error) {
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
        throw error
      }

      // Check if user was created but already exists (Supabase returns user even for existing emails in some cases)
      if (data.user && data.user.email_confirmed_at && !data.session) {
        throw new Error('This email address is already registered. Please sign in instead.')
      }

      // Check if user needs email verification
      const needsVerification = !data.user?.email_confirmed_at && !!data.user

      return {
        user: data.user,
        needsVerification
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
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
        throw error
      }

      return data.user
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return rejectWithValue(message)
    }
  }
)

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, token }: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      })

      if (error) throw error

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
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
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
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.user) {
          state.user = action.payload.user
          state.isAuthenticated = !action.payload.needsVerification
          state.needsVerification = action.payload.needsVerification
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
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.needsVerification = false
      })
      .addCase(verifyOtp.rejected, (state, action) => {
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
