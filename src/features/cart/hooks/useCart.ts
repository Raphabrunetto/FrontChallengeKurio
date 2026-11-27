
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartService } from '../services/cart.service'
import type { AddCartItemPayload } from '../types/cart'
import { useAuth } from '../../account/hooks/useAuth'

export function useCart() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const cartQueryKey = ['cart', user?.id ?? 'guest'] as const

  const cartQuery = useQuery({
    queryKey: cartQueryKey,
    queryFn: cartService.getCart,
  })

  const addItemMutation = useMutation({
    mutationFn: (payload: AddCartItemPayload) =>
      cartService.addItem(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKey, data)
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: ({
      nftId,
      quantity,
    }: {
      nftId: string
      quantity: number
    }) => cartService.updateItem(nftId, quantity),

    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKey, data)
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: (nftId: string) => cartService.removeItem(nftId),
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKey, data)
    },
  })

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKey, data)
    },
  })

  return {
    ...cartQuery,
    addItem: addItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
  }
}
