
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { walletService } from '../services/wallet.service'
import type { SaveWalletPayload } from '../types/account'

export function useWallets(enabled = true, collectorId?: string) {
  const walletQueryKey = ['wallets', collectorId ?? 'current'] as const
  const queryClient = useQueryClient()

  const walletsQuery = useQuery({
    queryKey: walletQueryKey,
    queryFn: walletService.getAll,
    staleTime: 30 * 1000,
    enabled,
  })

  const createMutation = useMutation({
    mutationFn: (payload: SaveWalletPayload) =>
      walletService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SaveWalletPayload
    }) => walletService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => walletService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
    },
  })

  return {
    wallets: walletsQuery.data ?? [],
    isLoading: walletsQuery.isLoading,
    isError: walletsQuery.isError,
    createWallet: createMutation.mutateAsync,
    updateWallet: updateMutation.mutateAsync,
    removeWallet: removeMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
