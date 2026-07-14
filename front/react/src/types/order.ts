export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  username: string
  note?: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export interface CreateOrderBody {
  items: { menuItemId: string; quantity: number }[]
  note?: string
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ListOrdersQuery {
  page?: number
  pageSize?: number
  username?: string
  menuItemName?: string
  startTime?: string
  endTime?: string
}

export interface ListOrdersResponse {
  orders: Order[]
  pagination: Pagination
}
