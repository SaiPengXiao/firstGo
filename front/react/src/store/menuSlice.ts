import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  createCategoryApi,
  createMenuItemApi,
  deleteCategoryApi,
  deleteMenuItemApi,
  fetchMenuApi,
  updateCategoryApi,
  updateMenuItemApi,
} from '../services/menuService'
import type {
  CartLine,
  CreateCategoryBody,
  CreateMenuItemBody,
  MenuCategoryRow,
  MenuItem,
  UpdateCategoryBody,
  UpdateMenuItemBody,
} from '../types/menu'

const CART_STORAGE_KEY = 'firstGo_menu_cart'

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CartLine[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  return []
}

function persistCart(lines: CartLine[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
}

export const loadMenu = createAsyncThunk(
  'menu/loadMenu',
  async (includeUnavailable: boolean | undefined, { rejectWithValue }) => {
    try {
      return await fetchMenuApi({ includeUnavailable: Boolean(includeUnavailable) })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '加载菜单失败')
    }
  },
)

export const createCategory = createAsyncThunk(
  'menu/createCategory',
  async (body: CreateCategoryBody, { rejectWithValue }) => {
    try {
      await createCategoryApi(body)
      return await fetchMenuApi({ includeUnavailable: true })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '创建分类失败')
    }
  },
)

export const updateCategory = createAsyncThunk(
  'menu/updateCategory',
  async (
    { id, body }: { id: string; body: UpdateCategoryBody },
    { rejectWithValue },
  ) => {
    try {
      await updateCategoryApi(id, body)
      return await fetchMenuApi({ includeUnavailable: true })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '更新分类失败')
    }
  },
)

export const deleteCategory = createAsyncThunk(
  'menu/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id)
      return await fetchMenuApi({ includeUnavailable: true })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '删除分类失败')
    }
  },
)

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (body: CreateMenuItemBody, { rejectWithValue }) => {
    try {
      await createMenuItemApi(body)
      return await fetchMenuApi({ includeUnavailable: true })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '创建菜品失败')
    }
  },
)

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async (
    { id, body }: { id: string; body: UpdateMenuItemBody },
    { rejectWithValue },
  ) => {
    try {
      await updateMenuItemApi(id, body)
      return await fetchMenuApi({ includeUnavailable: true })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '更新菜品失败')
    }
  },
)

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteMenuItemApi(id)
      return await fetchMenuApi({ includeUnavailable: true })
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : '删除菜品失败')
    }
  },
)

interface MenuState {
  categories: MenuCategoryRow[]
  items: MenuItem[]
  cart: CartLine[]
  orderNote: string
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: MenuState = {
  categories: [],
  items: [],
  cart: loadCart(),
  orderNote: '',
  loading: false,
  saving: false,
  error: null,
}

function applyMenuPayload(
  state: MenuState,
  payload: { categories: MenuCategoryRow[]; items: MenuItem[] },
) {
  state.categories = payload.categories
  state.items = payload.items
  const itemIds = new Set(payload.items.map((i) => i.id))
  state.cart = state.cart.filter((l) => itemIds.has(l.menuItemId))
  persistCart(state.cart)
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCartQuantity(
      state,
      action: PayloadAction<{ menuItemId: string; quantity: number }>,
    ) {
      const { menuItemId, quantity } = action.payload
      if (quantity <= 0) {
        state.cart = state.cart.filter((l) => l.menuItemId !== menuItemId)
      } else {
        const line = state.cart.find((l) => l.menuItemId === menuItemId)
        if (line) line.quantity = quantity
        else state.cart.push({ menuItemId, quantity })
      }
      persistCart(state.cart)
    },
    incrementCart(state, action: PayloadAction<string>) {
      const id = action.payload
      const line = state.cart.find((l) => l.menuItemId === id)
      if (line) line.quantity += 1
      else state.cart.push({ menuItemId: id, quantity: 1 })
      persistCart(state.cart)
    },
    decrementCart(state, action: PayloadAction<string>) {
      const id = action.payload
      const line = state.cart.find((l) => l.menuItemId === id)
      if (!line) return
      if (line.quantity <= 1) {
        state.cart = state.cart.filter((l) => l.menuItemId !== id)
      } else {
        line.quantity -= 1
      }
      persistCart(state.cart)
    },
    clearCart(state) {
      state.cart = []
      state.orderNote = ''
      persistCart(state.cart)
    },
    setOrderNote(state, action: PayloadAction<string>) {
      state.orderNote = action.payload
    },
    clearMenuError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMenu.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadMenu.fulfilled, (state, action) => {
        state.loading = false
        applyMenuPayload(state, action.payload)
      })
      .addCase(loadMenu.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? '加载菜单失败'
      })

    const savingThunks = [
      createCategory,
      updateCategory,
      deleteCategory,
      createMenuItem,
      updateMenuItem,
      deleteMenuItem,
    ]
    for (const thunk of savingThunks) {
      builder
        .addCase(thunk.pending, (state) => {
          state.saving = true
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.saving = false
          applyMenuPayload(state, action.payload)
        })
        .addCase(thunk.rejected, (state, action) => {
          state.saving = false
          state.error = (action.payload as string) ?? '操作失败'
        })
    }
  },
})

export const {
  setCartQuantity,
  incrementCart,
  decrementCart,
  clearCart,
  setOrderNote,
  clearMenuError,
} = menuSlice.actions

export default menuSlice.reducer