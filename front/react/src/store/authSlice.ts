import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/auth'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function loadTokenFromStorage(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  /** 是否已完成启动鉴权（无 token 或 /me 已结束） */
  authReady: boolean
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  isAuthenticated: Boolean(loadTokenFromStorage()),
  authReady: !loadTokenFromStorage(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.authReady = true
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user))
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.authReady = true
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user))
    },
    setUserFromMe(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.authReady = true
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload))
    },
    setAuthReady(state, action: PayloadAction<boolean>) {
      state.authReady = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.authReady = true
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    },
  },
})

export const {
  loginSuccess,
  registerSuccess,
  setUserFromMe,
  setAuthReady,
  logout,
} = authSlice.actions
export default authSlice.reducer