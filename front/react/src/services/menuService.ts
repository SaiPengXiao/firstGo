import type {
  ApiMenuItem,
  CreateCategoryBody,
  CreateMenuItemBody,
  MenuCategoryRow,
  MenuFullResponse,
  MenuItem,
  UpdateCategoryBody,
  UpdateMenuItemBody,
} from '../types/menu'
import { del, get, post, put } from './request'

function strId(v: string | number | undefined): string {
  if (v === undefined || v === null) return ''
  return String(v)
}

function pickImageUrl(raw: ApiMenuItem): string | undefined {
  const candidates = [
    raw.imageUrl,
    raw.image_url,
    raw.image,
    raw.img,
    raw.picUrl,
    raw.pic_url,
    raw.cover,
  ]
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return undefined
}

export function normalizeMenuItem(raw: ApiMenuItem, categoryIdFallback?: string): MenuItem {
  const categoryId =
    strId(raw.categoryId ?? raw.category_id) || categoryIdFallback || ''
  return {
    id: strId(raw.id),
    categoryId,
    name: raw.name,
    price: Number(raw.price),
    description: raw.description,
    imageUrl: pickImageUrl(raw),
    available: raw.isAvailable ?? raw.is_available ?? raw.available ?? true,
    sortOrder: raw.sortOrder ?? raw.sort_order,
    createdAt: raw.createdAt ?? raw.created_at,
  }
}

export function flattenMenuResponse(data: MenuFullResponse): {
  categories: MenuCategoryRow[]
  items: MenuItem[]
} {
  const categories: MenuCategoryRow[] = (data.categories ?? []).map((c) => ({
    id: strId(c.id),
    name: c.name,
    sortOrder: c.sortOrder ?? 0,
  }))
  const items: MenuItem[] = []
  for (const cat of data.categories ?? []) {
    const cid = strId(cat.id)
    for (const it of cat.items ?? []) {
      items.push(normalizeMenuItem(it, cid))
    }
  }
  return { categories, items }
}

export async function fetchMenuApi(options?: {
  includeUnavailable?: boolean
}): Promise<{ categories: MenuCategoryRow[]; items: MenuItem[] }> {
  const params: Record<string, string> = {}
  if (options?.includeUnavailable) {
    params.includeUnavailable = 'true'
  }
  const data = await get<MenuFullResponse>('/api/menu', { params })
  return flattenMenuResponse(data)
}

export async function fetchCategoriesApi(): Promise<MenuCategoryRow[]> {
  const data = await get<MenuCategoryRow[] | { categories: MenuCategoryRow[] }>(
    '/api/menu/categories',
  )
  if (Array.isArray(data)) return data.map((c) => ({ ...c, id: strId(c.id) }))
  return (data.categories ?? []).map((c) => ({ ...c, id: strId(c.id) }))
}

export async function fetchMenuItemsApi(options?: {
  categoryId?: string
  includeUnavailable?: boolean
}): Promise<MenuItem[]> {
  const params: Record<string, string> = {}
  if (options?.categoryId) params.categoryId = options.categoryId
  if (options?.includeUnavailable) params.includeUnavailable = 'true'
  const data = await get<ApiMenuItem[] | { items: ApiMenuItem[] }>('/api/menu/items', {
    params,
  })
  const list = Array.isArray(data) ? data : (data.items ?? [])
  return list.map((it) => normalizeMenuItem(it, options?.categoryId))
}

export async function fetchMenuItemByIdApi(id: string): Promise<MenuItem> {
  const raw = await get<ApiMenuItem>(`/api/menu/items/${id}`)
  return normalizeMenuItem(raw)
}

export async function createCategoryApi(body: CreateCategoryBody): Promise<MenuCategoryRow> {
  const row = await post<MenuCategoryRow>('/api/menu/categories', body)
  return { ...row, id: strId(row.id) }
}

export async function updateCategoryApi(
  id: string,
  body: UpdateCategoryBody,
): Promise<MenuCategoryRow> {
  const row = await put<MenuCategoryRow>(`/api/menu/categories/${id}`, body)
  return { ...row, id: strId(row.id) }
}

export async function deleteCategoryApi(id: string): Promise<void> {
  await del(`/api/menu/categories/${id}`)
}

export async function createMenuItemApi(body: CreateMenuItemBody): Promise<MenuItem> {
  const raw = await post<ApiMenuItem>('/api/menu/items', {
    ...body,
    isAvailable: body.isAvailable ?? true,
  })
  return normalizeMenuItem(raw, body.categoryId)
}

export async function updateMenuItemApi(
  id: string,
  body: UpdateMenuItemBody,
): Promise<MenuItem> {
  const payload: Record<string, unknown> = { ...body }
  if (body.isAvailable !== undefined) {
    payload.isAvailable = body.isAvailable
  }
  const raw = await put<ApiMenuItem>(`/api/menu/items/${id}`, payload)
  return normalizeMenuItem(raw)
}

export async function deleteMenuItemApi(id: string): Promise<void> {
  await del(`/api/menu/items/${id}`)
}