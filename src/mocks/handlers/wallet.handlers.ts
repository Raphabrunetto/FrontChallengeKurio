
import { http, HttpResponse } from 'msw'

import type {
  AuthResponse,
  CollectorWallet,
  SaveWalletPayload,
} from '../../features/account/types/account'

const WALLETS_KEY = 'kurio-wallets'
const SESSION_KEY = 'kurio-session'

type StoredWallet = CollectorWallet

function getSession(): AuthResponse | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) as AuthResponse : null
  } catch {
    return null
  }
}

function getWallets(): StoredWallet[] {
  try {
    const stored = localStorage.getItem(WALLETS_KEY)
    return stored ? JSON.parse(stored) as StoredWallet[] : []
  } catch {
    return []
  }
}

function saveWallets(wallets: StoredWallet[]) {
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets))
}

function getUserWallets(collectorId: string) {
  return getWallets().filter(
    wallet => wallet.collectorId === collectorId,
  )
}

function validatePayload(payload: SaveWalletPayload) {
  if (!payload.address?.trim()) {
    return 'Informe o endereço da carteira.'
  }

  if (payload.network !== 'Ethereum') {
    return 'Rede inválida.'
  }

  if (!['metamask', 'coinbase'].includes(payload.type)) {
    return 'Tipo de carteira inválido.'
  }

  if (!['primary', 'secondary'].includes(payload.position)) {
    return 'Posição da carteira inválida.'
  }

  return null
}

function requireSession() {
  const session = getSession()

  if (!session) {
    return null
  }

  return session.user
}

export const walletHandlers = [
  // Listar carteiras do colecionador autenticado
  http.get('/api/wallets', () => {
    const user = requireSession()

    if (!user) {
      return HttpResponse.json(
        { message: 'Usuário não autenticado.' },
        { status: 401 },
      )
    }

    return HttpResponse.json(getUserWallets(user.id))
  }),

  // Criar carteira
  http.post('/api/wallets', async ({ request }) => {
    const user = requireSession()

    if (!user) {
      return HttpResponse.json(
        { message: 'Usuário não autenticado.' },
        { status: 401 },
      )
    }

    const payload = await request.json() as SaveWalletPayload
    const validationError = validatePayload(payload)

    if (validationError) {
      return HttpResponse.json(
        { message: validationError },
        { status: 400 },
      )
    }

    const wallets = getWallets()
    const userWallets = getUserWallets(user.id)

    if (userWallets.some(wallet => wallet.position === payload.position)) {
      return HttpResponse.json(
        { message: 'Já existe uma carteira nessa posição.' },
        { status: 409 },
      )
    }

    const now = new Date().toISOString()

    const wallet: StoredWallet = {
      id: `wallet-${Date.now()}`,
      collectorId: user.id,
      position: payload.position,
      network: payload.network,
      address: payload.address.trim(),
      type: payload.type,
      ensName: payload.ensName?.trim() ?? '',
      createdAt: now,
      updatedAt: now,
    }

    wallets.push(wallet)
    saveWallets(wallets)

    return HttpResponse.json(wallet, { status: 201 })
  }),

  // Editar carteira
  http.put('/api/wallets/:id', async ({ params, request }) => {
    const user = requireSession()

    if (!user) {
      return HttpResponse.json(
        { message: 'Usuário não autenticado.' },
        { status: 401 },
      )
    }

    const payload = await request.json() as SaveWalletPayload
    const validationError = validatePayload(payload)

    if (validationError) {
      return HttpResponse.json(
        { message: validationError },
        { status: 400 },
      )
    }

    const wallets = getWallets()
    const index = wallets.findIndex(
      wallet =>
        wallet.id === String(params.id) &&
        wallet.collectorId === user.id,
    )

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Carteira não encontrada.' },
        { status: 404 },
      )
    }

    const duplicatePosition = wallets.some(
      wallet =>
        wallet.collectorId === user.id &&
        wallet.position === payload.position &&
        wallet.id !== String(params.id),
    )

    if (duplicatePosition) {
      return HttpResponse.json(
        { message: 'Já existe outra carteira nessa posição.' },
        { status: 409 },
      )
    }

    const current = wallets[index]

    const updatedWallet: StoredWallet = {
      ...current,
      position: payload.position,
      network: payload.network,
      address: payload.address.trim(),
      type: payload.type,
      ensName: payload.ensName?.trim() ?? '',
      updatedAt: new Date().toISOString(),
    }

    wallets[index] = updatedWallet
    saveWallets(wallets)

    return HttpResponse.json(updatedWallet)
  }),

  // Remover carteira
  http.delete('/api/wallets/:id', ({ params }) => {
    const user = requireSession()

    if (!user) {
      return HttpResponse.json(
        { message: 'Usuário não autenticado.' },
        { status: 401 },
      )
    }

    const wallets = getWallets()
    const wallet = wallets.find(
      item =>
        item.id === String(params.id) &&
        item.collectorId === user.id,
    )

    if (!wallet) {
      return HttpResponse.json(
        { message: 'Carteira não encontrada.' },
        { status: 404 },
      )
    }

    saveWallets(
      wallets.filter(item => item.id !== wallet.id),
    )

    return HttpResponse.json({
      message: 'Carteira removida com sucesso.',
    })
  }),
]
