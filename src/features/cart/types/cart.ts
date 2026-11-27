
import type { NFT } from '../../catalog/types/nft'

export interface CartItem {
  nft: NFT
  quantity: number
}

export interface CartResponse {
  items: CartItem[]
  totalItems: number
}

export interface AddCartItemPayload {
  nftId: string
  quantity: number
}
