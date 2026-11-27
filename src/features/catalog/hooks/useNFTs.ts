
import { useQuery } from '@tanstack/react-query'

import { nftService } from '../services/nft.service'

import type { NFTListParams } from '../types/nft'

export function useNFTs(params: NFTListParams = {}) {
  return useQuery({
    queryKey: ['nfts', params],
    queryFn: () => nftService.getAll(params),
    staleTime: 30 * 1000,
  })
}
