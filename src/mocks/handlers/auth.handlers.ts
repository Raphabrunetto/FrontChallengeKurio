import { http, HttpResponse } from 'msw'
import type {
  AuthResponse,
  Collector,
  LoginPayload,
  RegisterPayload,
} from '../../features/account/types/account'

const USERS_KEY = 'kurio-users'
const SESSION_KEY = 'kurio-session'

interface StoredUser {
  id: string
  name: string
  email: string
  passwordSalt: string
  passwordHash: string
  createdAt: string
}

async function hashPassword(
  password: string,
  salt: string = crypto.randomUUID(),
) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${salt}:${password}`),
  )
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')

  return { salt, hash }
}

function getUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored) as Partial<StoredUser>[]
    const users = parsed.filter(
      (user): user is StoredUser =>
        typeof user.id === 'string' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        typeof user.passwordSalt === 'string' &&
        typeof user.passwordHash === 'string' &&
        typeof user.createdAt === 'string',
    )

    // Remove legacy mock records that stored passwords in clear text.
    if (users.length !== parsed.length) saveUsers(users)
    return users
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession(): AuthResponse | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) as AuthResponse : null
  } catch {
    return null
  }
}

function createSession(user: StoredUser): AuthResponse {
  const collector: Collector = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }

  const session: AuthResponse = {
    user: collector,
    token: `kurio-demo-${user.id}`,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return session
}

export const authHandlers = [
  // Cadastro
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as RegisterPayload

    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!name || !email || !password) {
      return HttpResponse.json(
        { message: 'Preencha todos os campos.' },
        { status: 400 },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json(
        { message: 'Informe um e-mail válido.' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return HttpResponse.json(
        { message: 'A senha deve ter pelo menos 6 caracteres.' },
        { status: 400 },
      )
    }

    const users = getUsers()

    if (users.some((user) => user.email === email)) {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado.' },
        { status: 409 },
      )
    }

    const { salt, hash } = await hashPassword(password)
    const newUser: StoredUser = {
      id: `collector-${Date.now()}`,
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    return HttpResponse.json(createSession(newUser), {
      status: 201,
    })
  }),

  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginPayload

    const email = body.email?.trim().toLowerCase()
    const users = getUsers()

    const user = users.find((item) => item.email === email)
    const { hash } = user
      ? await hashPassword(body.password, user.passwordSalt)
      : { hash: '' }

    if (!user || user.passwordHash !== hash) {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos.' },
        { status: 401 },
      )
    }

    return HttpResponse.json(createSession(user))
  }),

  // Consultar usuário autenticado
  http.get('/api/auth/me', () => {
    const session = getSession()

    if (!session) {
      return HttpResponse.json(
        { message: 'Usuário não autenticado.' },
        { status: 401 },
      )
    }

    return HttpResponse.json(session.user)
  }),

  // Logout
  http.post('/api/auth/logout', () => {
    localStorage.removeItem(SESSION_KEY)

    return HttpResponse.json({
      message: 'Logout realizado com sucesso.',
    })
  }),
]
