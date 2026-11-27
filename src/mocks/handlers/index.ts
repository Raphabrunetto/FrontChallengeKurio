
import { nftHandlers } from './nft.handlers'
import { cartHandlers } from './cart.handlers'
import { authHandlers } from './auth.handlers'
import { walletHandlers } from './wallet.handlers'

export const handlers = [
  ...nftHandlers,
  ...cartHandlers,
  ...authHandlers,
  ...walletHandlers,
]
