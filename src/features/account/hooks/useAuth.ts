
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { authService } from '../services/auth.service'
import type {
  LoginPayload,
  RegisterPayload,
  Collector,
} from '../types/account'

const AUTH_QUERY_KEY = ['auth', 'user']

export function useAuth() {
  const queryClient = useQueryClient()

  // Recupera a sessão persistida
  const userQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // Cadastro
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      authService.register(payload),

    onSuccess: (data) => {
      queryClient.setQueryData<Collector>(
        AUTH_QUERY_KEY,
        data.user,
      )
    },
  })

  // Login
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      authService.login(payload),

    onSuccess: (data) => {
      queryClient.setQueryData<Collector>(
        AUTH_QUERY_KEY,
        data.user,
      )
    },
  })

  // Logout
  const logoutMutation = useMutation({
    mutationFn: authService.logout,

    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null)

      // Remove dados privados do cache para impedir que outra conta
      // veja temporariamente informações da sessão anterior.
      queryClient.removeQueries({ queryKey: ['wallets'] })
      queryClient.removeQueries({ queryKey: ['orders'] })
      queryClient.removeQueries({ queryKey: ['cart'] })
    },
  })

  return {
    user: userQuery.data ?? null,
    isAuthenticated: Boolean(userQuery.data),
    isLoading: userQuery.isLoading,

    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
