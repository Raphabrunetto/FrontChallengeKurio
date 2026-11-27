import { Router } from 'express'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { sessions, users } from '../store.js'

const router = Router()
const PASSWORD_SALT_BYTES = 16
const PASSWORD_HASH_BYTES = 64

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
}

function hashPassword(password) {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex')
  const hash = scryptSync(password, salt, PASSWORD_HASH_BYTES).toString('hex')
  return { salt, hash }
}

function verifyPassword(password, user) {
  const supplied = Buffer.from(scryptSync(password, user.passwordSalt, PASSWORD_HASH_BYTES).toString('hex'), 'hex')
  const expected = Buffer.from(user.passwordHash, 'hex')
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

function createSession(user) {
  const token = randomBytes(32).toString('hex')
  sessions.set(token, { id: user.id })
  return { user: publicUser(user), token }
}

router.post('/register', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!name || !email || !password) return res.status(400).json({ message: 'Preencha todos os campos.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Informe um e-mail válido.' })
  if (password.length < 6) return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' })
  if (users.has(email)) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' })

  const { salt, hash } = hashPassword(password)
  const user = {
    id: `collector-${randomUUID()}`,
    name,
    email,
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  }
  users.set(email, user)
  return res.status(201).json(createSession(user))
})

router.post('/login', (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const user = users.get(email)
  if (!user || !verifyPassword(password, user)) {
    return res.status(401).json({ message: 'E-mail ou senha incorretos.' })
  }
  return res.json(createSession(user))
})

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  const session = token ? sessions.get(token) : null
  const user = session && [...users.values()].find((entry) => entry.id === session.id)
  if (!user) return res.status(401).json({ message: 'Usuário não autenticado.' })
  return res.json(publicUser(user))
})

router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (token) sessions.delete(token)
  return res.json({ message: 'Logout realizado com sucesso.' })
})

export default router
