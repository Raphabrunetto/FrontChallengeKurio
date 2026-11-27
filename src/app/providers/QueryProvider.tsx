import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import type { ReactNode } from 'react'

import { SocketProvider } from './SocketProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({
  children,
}: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </QueryClientProvider>
  )
}
