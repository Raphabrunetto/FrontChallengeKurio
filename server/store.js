
import { randomUUID } from 'node:crypto'
import initialNFTs from './data/nfts.json' with { type: 'json' }

export const sessions = new Map()
export const carts = new Map()
export const orders = new Map()
export const processedCheckouts = new Map()

export const nfts = new Map(
  initialNFTs.map((nft) => [
    nft.id,
    {
      ...nft,
      version: 1,
    },
  ]),
)

export function createOrderId() {
  return `ORD-${randomUUID()}`
}

export function getSessionUser(token) {
  return sessions.get(token) ?? null
}

export function getNFT(id) {
  return nfts.get(id) ?? null
}

export function updateNFT(id, changes) {
  const current = nfts.get(id)

  if (!current) {
    return null
  }

  const updated = {
    ...current,
    ...changes,
    id: current.id,
    version: current.version + 1,
  }

  nfts.set(id, updated)

  return updated
}
