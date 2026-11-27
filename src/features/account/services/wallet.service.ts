
import { api } from '../../../services/api/axios'

import type {
  CollectorWallet,
  SaveWalletPayload,
} from '../types/account'

export const walletService = {
  async getAll() {
    const response = await api.get<CollectorWallet[]>('/api/wallets')
    return response.data
  },

  async create(payload: SaveWalletPayload) {
    const response = await api.post<CollectorWallet>(
      '/api/wallets',
      payload,
    )

    return response.data
  },

  async update(id: string, payload: SaveWalletPayload) {
    const response = await api.put<CollectorWallet>(
      `/api/wallets/${id}`,
      payload,
    )

    return response.data
  },

  async remove(id: string) {
    const response = await api.delete(`/api/wallets/${id}`)
    return response.data
  },
}
