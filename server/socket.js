
import { Server } from 'socket.io'
import { randomUUID } from 'node:crypto'
import { getSessionUser, nfts, orders } from './store.js'

export function configureSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN?.split(',') ?? [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ],
      methods: ['GET', 'POST'],
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    const user = getSessionUser(token)

    if (!user) {
      return next(new Error('Sessão inválida'))
    }

    socket.data.user = user
    next()
  })

  io.on('connection', (socket) => {
    const user = socket.data.user

    socket.join(`user:${user.id}`)

    socket.on('reconcile', ({ nftIds = [], orderIds = [] } = {}, callback) => {
      const currentNFTs = nftIds
        .map((id) => nfts.get(id))
        .filter(Boolean)

      const currentOrders = orderIds
        .map((id) => orders.get(id))
        .filter((order) => order?.collectorId === user.id)
        .map(({ collectorId, ...order }) => order)

      callback?.({
        nfts: currentNFTs,
        orders: currentOrders,
      })
    })
  })

  return io
}

export function emitNFTUpdated(io, nft) {
  io.emit('nft.updated', {
    eventId: randomUUID(),
    resourceId: nft.id,
    version: nft.version,
    price: nft.price,
    availableEditions: nft.availableEditions,
    occurredAt: new Date().toISOString(),
  })
}

export function emitOrderUpdated(io, order) {
  io.to(`user:${order.collectorId}`).emit('order.updated', {
    eventId: randomUUID(),
    resourceId: order.id,
    version: order.version,
    status: order.status,
    occurredAt: new Date().toISOString(),
  })
}
