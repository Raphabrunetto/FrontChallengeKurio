
import { api, AUTH_TOKEN_KEY, USE_MOCKS } from '../../../services/api/axios'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  Collector,
} from '../types/account'

function persistSession(data: AuthResponse) {
  localStorage.setItem(AUTH_TOKEN_KEY, data.token)
  return data
}

// Keep simulated auth requests on the app origin so MSW controls the demo flow.
const authConfig = USE_MOCKS ? { baseURL: '/' } : undefined

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>('/api/auth/register', payload, authConfig)
    return persistSession(response.data)
  },

  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>('/api/auth/login', payload, authConfig)
    return persistSession(response.data)
  },

  async getMe() {
    const response = await api.get<Collector>('/api/auth/me', authConfig)
    return response.data
  },

  async logout() {
    const response = await api.post('/api/auth/logout', {}, authConfig)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return response.data
  },
}
