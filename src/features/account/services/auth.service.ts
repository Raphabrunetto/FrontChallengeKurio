
import { api, AUTH_TOKEN_KEY } from '../../../services/api/axios'
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

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>('/api/auth/register', payload)
    return persistSession(response.data)
  },

  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>('/api/auth/login', payload)
    return persistSession(response.data)
  },

  async getMe() {
    const response = await api.get<Collector>('/api/auth/me')
    return response.data
  },

  async logout() {
    const response = await api.post('/api/auth/logout')
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return response.data
  },
}
