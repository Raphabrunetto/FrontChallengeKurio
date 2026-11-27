import axios from 'axios'

export const AUTH_TOKEN_KEY = 'kurio-auth-token'
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV
    ? 'http://localhost:3001'
    : 'https://frontchallengekurio.onrender.com'
)

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
