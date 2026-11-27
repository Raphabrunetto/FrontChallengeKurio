
import { api } from '../../../services/api/axios'
import type { Order } from '../types/order'

export const orderService = {
  async getAll() {
    const response = await api.get<Order[]>('/api/orders')
    return response.data
  },
}
