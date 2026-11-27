
import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

import nftRoutes from './routes/nfts.js'
import cartRoutes from './routes/cart.js'
import { createDevRouter } from './routes/dev.js'
import { configureSocket } from './socket.js'
import { sessions, getSessionUser } from './store.js'

const app = express()
const httpServer = createServer(app)

// Middlewares globais: devem vir antes das rotas.
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') ?? [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
}))

app.use(express.json())

// Disponibiliza a autenticação para as rotas.
app.locals.getSessionUser = getSessionUser

// Socket.IO
const io = configureSocket(httpServer)

// Rotas da aplicação
app.use('/api/nfts', nftRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/dev', createDevRouter(io))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Endpoint temporário de desenvolvimento.
// Será substituído pela autenticação integrada ao fluxo real do Kurio.
app.post('/dev/session', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' })
  }

  const userId = req.body?.userId

  if (!userId) {
    return res.status(400).json({ message: 'userId obrigatório' })
  }

  const token = randomUUID()

  sessions.set(token, {
    id: String(userId),
  })

  return res.json({ token })
})

const port = Number(process.env.PORT ?? 3001)

httpServer.listen(port, () => {
  console.log(`Kurio realtime server: http://localhost:${port}`)
})
