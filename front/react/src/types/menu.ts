/** 后端分类 */
export interface MenuCategoryRow {
  id: string
  name: string
  sortOrder: number
}

/** 前端统一菜品模型（由 API 归一化） */
export interface MenuItem {
  id: string
  categoryId: string
  name: string
  price: number
  description?: string
  imageUrl?: string
  available: boolean
  sortOrder?: number
  createdAt?: string
}

export interface CartLine {
  menuItemId: string
  quantity: number
}

export interface OrderDraft {
  id: string
  lines: CartLine[]
  note?: string
  createdAt: string
  status: 'draft' | 'submitted'
}

/** GET /api/menu 响应 */
export interface MenuFullResponse {
  categories: Array<
    MenuCategoryRow & {
      items?: ApiMenuItem[]
    }
  >
}

/** 后端菜品字段（兼容 snake_case） */
export interface ApiMenuItem {
  id: string | number
  categoryId?: string | number
  category_id?: string | number
  name: string
  price: number
  description?: string
  imageUrl?: string
  image_url?: string
  image?: string
  img?: string
  picUrl?: string
  pic_url?: string
  cover?: string
  isAvailable?: boolean
  is_available?: boolean
  available?: boolean
  sortOrder?: number
  sort_order?: number
  createdAt?: string
  created_at?: string
}

export type CreateCategoryBody = {
  name: string
  sortOrder?: number
}

export type UpdateCategoryBody = {
  name?: string
  sortOrder?: number
}

export type CreateMenuItemBody = {
  categoryId: string
  name: string
  price: number
  description?: string
  imageUrl?: string
  isAvailable?: boolean
  sortOrder?: number
}

export type UpdateMenuItemBody = Partial<CreateMenuItemBody>