import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import menuReducer from './menuSlice'
import postsReducer from './postsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    menu: menuReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch