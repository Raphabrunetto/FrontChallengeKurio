
import type { NFT } from '../../catalog/types/nft'

export type PaymentMethod = 'pix' | 'wallet'

export interface OrderItem {
  nft: NFT
  quantity: number
  unitPrice: string
}

export interface OrderWallet {
  id: string
  position: 'primary' | 'secondary'
  network: string
  address: string
  type: 'metamask' | 'coinbase'
  ensName: string
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: string
  discount: string
  networkFee: string
  total: string
  couponCode: string | null
  paymentMethod: PaymentMethod
  wallet: OrderWallet | null
  status: 'completed'
  createdAt: string
}

export interface CheckoutPayload {
  paymentMethod: PaymentMethod
  couponCode?: string
  walletId?: string
}