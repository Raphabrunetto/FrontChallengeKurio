
import { api } from '../../../services/api/axios'

import type {
  NFT,
  NFTListParams,
  NFTListResponse,
} from '../types/nft'

export const nftService = {
  async getAll(params: NFTListParams = {}) {
    const response = await api.get<NFTListResponse>(
      '/api/nfts',
      { params },
    )

    return response.data
  },

  async getById(id: string) {
    const response = await api.get<NFT>(
      `/api/nfts/${id}`,
    )

    return response.data
  },
}
