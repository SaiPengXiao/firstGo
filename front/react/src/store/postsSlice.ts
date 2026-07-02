import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Post } from '../types/post'

interface PostsState {
  userPosts: Post[]
}

const initialState: PostsState = {
  userPosts: [],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost(state, action: PayloadAction<Post>) {
      state.userPosts.unshift(action.payload)
    },
  },
})

export const { addPost } = postsSlice.actions
export default postsSlice.reducer
