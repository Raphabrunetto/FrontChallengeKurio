import { authHandlers } from './auth.handlers'
import { cartHandlers } from './cart.handlers'
import { nftHandlers } from './nft.handlers'
import { walletHandlers } from './wallet.handlers'

export const handlers = [
  ...authHandlers,
  ...nftHandlers,
  ...cartHandlers,
  ...walletHandlers,
]
