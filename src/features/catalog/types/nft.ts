export interface NFT {
  id: string
  version?: number
  name: string
  description: string
  image: string
  collection: string
  creator: string
  price: string
  currency: 'ETH'
  category: string
  availableEditions: number
  totalEditions: number
  createdAt: string
  featured: boolean
  version?: number
}

export interface NFTListResponse {
  items: NFT[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface NFTListParams {
  search?: string
  category?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
  tab?: 'all' | 'new-releases' | 'trending'
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}