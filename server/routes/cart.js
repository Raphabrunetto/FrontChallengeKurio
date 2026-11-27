
import { Router } from 'express'
import { carts, getNFT } from '../store.js'

const router = Router()

function getOwner(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  const user = req.app.locals.getSessionUser(token)

  // Identificação temporária para visitantes.
  return user?.id ?? 'guest'
}

function getCart(owner) {
  return carts.get(owner) ?? []
}

function getCartResponse(owner) {
  const items = getCart(owner)
    .map((item) => {
      const nft = getNFT(item.nftId)

      if (!nft) return null

      return {
        nft,
        quantity: item.quantity,
      }
    })
    .filter(Boolean)

  return {
    items,
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
  }
}

router.get('/', (req, res) => {
  const owner = getOwner(req)
  res.json(getCartResponse(owner))
})

router.post('/items', (req, res) => {
  const owner = getOwner(req)
  const { nftId, quantity } = req.body

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantidade inválida.' })
  }

  const nft = getNFT(nftId)

  if (!nft) {
    return res.status(404).json({ message: 'NFT não encontrado.' })
  }

  const cart = getCart(owner)
  const existing = cart.find((item) => item.nftId === nftId)
  const newQuantity = (existing?.quantity ?? 0) + quantity

  if (newQuantity > nft.availableEditions) {
    return res.status(409).json({
      message: 'Quantidade indisponível em estoque.',
    })
  }

  if (existing) {
    existing.quantity = newQuantity
  } else {
    cart.push({ nftId, quantity })
  }

  carts.set(owner, cart)

  return res.status(201).json(getCartResponse(owner))
})

router.patch('/items/:id', (req, res) => {
  const owner = getOwner(req)
  const { quantity } = req.body
  const nftId = req.params.id

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantidade inválida.' })
  }

  const cart = getCart(owner)
  const item = cart.find((entry) => entry.nftId === nftId)
  const nft = getNFT(nftId)

  if (!item || !nft) {
    return res.status(404).json({ message: 'Item não encontrado.' })
  }

  if (quantity > nft.availableEditions) {
    return res.status(409).json({
      message: 'Quantidade indisponível em estoque.',
    })
  }

  item.quantity = quantity
  carts.set(owner, cart)

  return res.json(getCartResponse(owner))
})

router.delete('/items/:id', (req, res) => {
  const owner = getOwner(req)
  const cart = getCart(owner).filter(
    (item) => item.nftId !== req.params.id,
  )

  carts.set(owner, cart)

  return res.json(getCartResponse(owner))
})

router.delete('/', (req, res) => {
  const owner = getOwner(req)
  carts.set(owner, [])

  return res.json(getCartResponse(owner))
})

export default router
