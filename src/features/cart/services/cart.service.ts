
import { api } from '../../../services/api/axios'
import type {
  CartResponse,
  AddCartItemPayload,
} from '../types/cart'
import type { CheckoutPayload, Order } from '../types/order'

export const cartService = {
  async getCart() {
    const response = await api.get<CartResponse>('/api/cart')
    return response.data
  },

  async addItem(payload: AddCartItemPayload) {
    const response = await api.post<CartResponse>(
      '/api/cart/items',
      payload,
    )
    return response.data
  },

  async updateItem(nftId: string, quantity: number) {
    const response = await api.patch<CartResponse>(
      `/api/cart/items/${nftId}`,
      { quantity },
    )
    return response.data
  },

  async removeItem(nftId: string) {
    const response = await api.delete<CartResponse>(
      `/api/cart/items/${nftId}`,
    )
    return response.data
  },

  async clearCart() {
    const response = await api.delete<CartResponse>('/api/cart')
    return response.data
  },

  async checkout(payload: CheckoutPayload) {
    const response = await api.post<Order>('/api/checkout', payload)
    return response.data
  },
}
