import { get, post } from './request'
import type { CreateOrderBody, Order } from '../types/order'

/** 下单（登录用户） */
export async function createOrderApi(body: CreateOrderBody): Promise<Order> {
  return post<Order>('/api/orders', body)
}

/** 订单列表（管理员） */
export async function listOrdersApi(): Promise<Order[]> {
  const data = await get<{ orders: Order[] }>('/api/orders')
  return data.orders ?? []
}
