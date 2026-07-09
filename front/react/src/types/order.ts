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
