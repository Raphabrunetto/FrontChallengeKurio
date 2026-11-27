import { http, HttpResponse } from 'msw'
import Decimal from 'decimal.js'

import { mockNFTs } from '../fixtures/nfts'

import type { CartItem, CartResponse } from '../../features/cart/types/cart'
import type { CheckoutPayload, Order } from '../../features/cart/types/order'
import type {
  AuthResponse,
  CollectorWallet,
} from '../../features/account/types/account'

const LEGACY_CART_KEY = 'kurio-cart'
const CART_KEY_PREFIX = 'kurio-cart:'
const INVENTORY_KEY = 'kurio-inventory'
const ORDERS_KEY = 'kurio-orders'
const WALLETS_KEY = 'kurio-wallets'
const SESSION_KEY = 'kurio-session'

const NETWORK_FEE = new Decimal('0.015')

const COUPONS: Record<string, number> = {
  KURIO10: 10,
  KURIO20: 20,
}

interface StoredOrder extends Order {
  collectorId: string | null
}

function getSession(): AuthResponse | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? (JSON.parse(stored) as AuthResponse) : null
  } catch {
    return null
  }
}

function getCollectorId(): string | null {
  return getSession()?.user?.id ?? null
}

function getCartStorageKey(): string {
  return `${CART_KEY_PREFIX}${getCollectorId() ?? 'guest'}`
}

function getCart(): CartItem[] {
  try {
    const key = getCartStorageKey()
    const stored = localStorage.getItem(key)

    // Preserva o carrinho antigo somente para visitantes, sem expor dados
    // que possam ter sido criados durante uma sessão autenticada.
    if (stored === null && getCollectorId() === null) {
      const legacyCart = localStorage.getItem(LEGACY_CART_KEY)
      if (legacyCart) {
        localStorage.setItem(key, legacyCart)
        localStorage.removeItem(LEGACY_CART_KEY)
        return JSON.parse(legacyCart) as CartItem[]
      }
    }

    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(items))
}

function getInventory(): Record<string, number> {
  try {
    const stored = localStorage.getItem(INVENTORY_KEY)

    if (stored) {
      return JSON.parse(stored) as Record<string, number>
    }
  } catch {
    // Se os dados estiverem inválidos, usamos o estoque inicial.
  }

  return Object.fromEntries(
    mockNFTs.map((nft) => [nft.id, nft.availableEditions]),
  )
}

function saveInventory(inventory: Record<string, number>) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory))
}

function getResponse(items: CartItem[]): CartResponse {
  const inventory = getInventory()

  const updatedItems = items.map((item) => ({
    ...item,
    nft: {
      ...item.nft,
      availableEditions: inventory[item.nft.id] ?? 0,
    },
  }))

  return {
    items: updatedItems,
    totalItems: updatedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  }
}

function getStoredOrders(): StoredOrder[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    return stored ? (JSON.parse(stored) as StoredOrder[]) : []
  } catch {
    return []
  }
}

function saveStoredOrders(orders: StoredOrder[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function getStoredWallets(): CollectorWallet[] {
  try {
    const stored = localStorage.getItem(WALLETS_KEY)
    return stored ? (JSON.parse(stored) as CollectorWallet[]) : []
  } catch {
    return []
  }
}

export const cartHandlers = [
  // Consultar somente o carrinho do visitante ou do usuário atual.
  http.get('/api/cart', () => {
    return HttpResponse.json(getResponse(getCart()))
  }),

  // Adicionar NFT ao carrinho atual.
  http.post('/api/cart/items', async ({ request }) => {
    const body = await request.json() as {
      nftId: string
      quantity: number
    }

    const nft = mockNFTs.find((item) => item.id === body.nftId)

    if (!nft) {
      return HttpResponse.json(
        { message: 'NFT não encontrado.' },
        { status: 404 },
      )
    }

    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
      return HttpResponse.json(
        { message: 'Quantidade inválida.' },
        { status: 400 },
      )
    }

    const cart = getCart()
    const existingItem = cart.find((item) => item.nft.id === nft.id)
    const newQuantity = (existingItem?.quantity ?? 0) + body.quantity

    const inventory = getInventory()
    const available = inventory[nft.id] ?? nft.availableEditions

    if (newQuantity > available) {
      return HttpResponse.json(
        { message: 'Quantidade indisponível em estoque.' },
        { status: 409 },
      )
    }

    if (existingItem) {
      existingItem.quantity = newQuantity
    } else {
      cart.push({ nft, quantity: body.quantity })
    }

    saveCart(cart)

    return HttpResponse.json(getResponse(cart), { status: 201 })
  }),

  // Atualizar quantidade de um NFT no carrinho atual.
  http.patch('/api/cart/items/:id', async ({ params, request }) => {
    const body = await request.json() as { quantity: number }
    const nftId = String(params.id)
    const cart = getCart()
    const item = cart.find((cartItem) => cartItem.nft.id === nftId)

    if (!item) {
      return HttpResponse.json(
        { message: 'Item não encontrado no carrinho.' },
        { status: 404 },
      )
    }

    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
      return HttpResponse.json(
        { message: 'Quantidade inválida.' },
        { status: 400 },
      )
    }

    const available = getInventory()[nftId] ?? 0

    if (body.quantity > available) {
      return HttpResponse.json(
        { message: 'Quantidade indisponível em estoque.' },
        { status: 409 },
      )
    }

    item.quantity = body.quantity
    saveCart(cart)

    return HttpResponse.json(getResponse(cart))
  }),

  // Remover NFT do carrinho atual.
  http.delete('/api/cart/items/:id', ({ params }) => {
    const cart = getCart()
    const updatedCart = cart.filter((item) => item.nft.id !== params.id)

    saveCart(updatedCart)

    return HttpResponse.json(getResponse(updatedCart))
  }),

  // Limpar somente o carrinho atual.
  http.delete('/api/cart', () => {
    saveCart([])
    return HttpResponse.json(getResponse([]))
  }),

  // Consultar somente o histórico do usuário autenticado.
  http.get('/api/orders', () => {
    const collectorId = getCollectorId()

    if (!collectorId) {
      return HttpResponse.json(
        { message: 'Você precisa estar autenticado para consultar seus pedidos.' },
        { status: 401 },
      )
    }

    const orders: Order[] = getStoredOrders()
      .filter((order) => order.collectorId === collectorId)
      .map((order) => ({ ...order }))

    return HttpResponse.json(orders)
  }),

  // Finalizar compra do carrinho atual.
  http.post('/api/checkout', async ({ request }) => {
    const body = await request.json() as CheckoutPayload

    if (!['pix', 'wallet'].includes(body.paymentMethod)) {
      return HttpResponse.json(
        { message: 'Forma de pagamento inválida.' },
        { status: 400 },
      )
    }

    const cart = getCart()

    if (cart.length === 0) {
      return HttpResponse.json(
        { message: 'O carrinho está vazio.' },
        { status: 400 },
      )
    }

    const session = getSession()
    const collectorId = session?.user?.id ?? null
    let selectedWallet: CollectorWallet | null = null

    if (body.paymentMethod === 'wallet') {
      if (!body.walletId) {
        return HttpResponse.json(
          { message: 'Selecione uma carteira para continuar.' },
          { status: 400 },
        )
      }

      if (!collectorId) {
        return HttpResponse.json(
          { message: 'Você precisa estar autenticado para utilizar uma carteira.' },
          { status: 401 },
        )
      }

      selectedWallet = getStoredWallets().find(
        (wallet) =>
          wallet.id === body.walletId && wallet.collectorId === collectorId,
      ) ?? null

      if (!selectedWallet) {
        return HttpResponse.json(
          { message: 'Carteira não encontrada na sua conta.' },
          { status: 404 },
        )
      }
    }

    const couponCode = body.couponCode?.trim().toUpperCase() || null
    const discountPercentage = couponCode ? COUPONS[couponCode] : 0

    if (couponCode && discountPercentage === undefined) {
      return HttpResponse.json(
        { message: 'Cupom inválido ou expirado.' },
        { status: 400 },
      )
    }

    const inventory = getInventory()

    for (const item of cart) {
      const available = inventory[item.nft.id] ?? 0

      if (item.quantity > available) {
        return HttpResponse.json(
          { message: `Estoque insuficiente para ${item.nft.name}.` },
          { status: 409 },
        )
      }
    }

    const subtotal = cart.reduce(
      (sum, item) => sum.plus(new Decimal(item.nft.price).mul(item.quantity)),
      new Decimal(0),
    )

    const discount = subtotal.mul(discountPercentage ?? 0).div(100)
    const networkFee = NETWORK_FEE
    const total = Decimal.max(subtotal.minus(discount).plus(networkFee), 0)

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart.map((item) => ({
        nft: item.nft,
        quantity: item.quantity,
        unitPrice: item.nft.price,
      })),
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      networkFee: networkFee.toFixed(3),
      total: total.toFixed(3),
      couponCode,
      paymentMethod: body.paymentMethod,
      wallet: selectedWallet
        ? {
            id: selectedWallet.id,
            position: selectedWallet.position,
            network: selectedWallet.network,
            address: selectedWallet.address,
            type: selectedWallet.type,
            ensName: selectedWallet.ensName,
          }
        : null,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }

    for (const item of cart) {
      inventory[item.nft.id] -= item.quantity
    }

    saveInventory(inventory)

    const orders = getStoredOrders()
    orders.unshift({ ...order, collectorId })
    saveStoredOrders(orders)

    saveCart([])

    return HttpResponse.json(order, { status: 201 })
  }),
]
