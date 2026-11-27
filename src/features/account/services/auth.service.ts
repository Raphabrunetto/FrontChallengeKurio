import { api } from '../../../services/api/axios'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  Collector,
} from '../types/account'

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>(
      '/api/auth/register',
      payload,
    )
    return response.data
  },

  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>(
      '/api/auth/login',
      payload,
    )
    return response.data
  },

  async getMe() {
    const response = await api.get<Collector>('/api/auth/me')
    return response.data
  },

  async logout() {
    const response = await api.post('/api/auth/logout')
    return response.data
  },
}