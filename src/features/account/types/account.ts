
export interface Collector {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: Collector
  token: string
}

// Carteiras do colecionador

export type WalletType = 'metamask' | 'coinbase'

export type WalletNetwork = 'Ethereum'

export type WalletPosition = 'primary' | 'secondary'

export interface CollectorWallet {
  id: string
  collectorId: string
  position: WalletPosition
  network: WalletNetwork
  address: string
  type: WalletType
  ensName: string
  createdAt: string
  updatedAt: string
}

export interface SaveWalletPayload {
  position: WalletPosition
  network: WalletNetwork
  address: string
  type: WalletType
  ensName?: string
}
