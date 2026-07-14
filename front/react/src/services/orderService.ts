import { get, post } from './request'
import type { CreateOrderBody, ListOrdersQuery, ListOrdersResponse, Order } from '../types/order'

/** 下单（登录用户） */
export async function createOrderApi(body: CreateOrderBody): Promise<Order> {
  return post<Order>('/api/orders', body)
}

/** 订单列表（管理员） */
export async function listOrdersApi(query: ListOrdersQuery = {}): Promise<ListOrdersResponse> {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.pageSize) params.set('pageSize', String(query.pageSize))
  if (query.username) params.set('username', query.username)
  if (query.menuItemName) params.set('menuItemName', query.menuItemName)
  if (query.startTime) params.set('startTime', query.startTime)
  if (query.endTime) params.set('endTime', query.endTime)

  const qs = params.toString()
  return get<ListOrdersResponse>(`/api/admin/orders${qs ? `?${qs}` : ''}`)
}
