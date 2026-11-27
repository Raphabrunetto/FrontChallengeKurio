export type WalletType = 'metamask' | 'coinbase'

export interface CollectorDetails {
  displayName: string
  username: string
  email: string
  network: string
  walletAddress: string
  walletType: WalletType
  ensName: string
  referralCode: string
  note: string
}
