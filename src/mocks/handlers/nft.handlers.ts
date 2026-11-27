
import { http, HttpResponse } from 'msw'
import { mockNFTs } from '../fixtures/nfts'
import Decimal from 'decimal.js'

// Consultar NFTs com estoque atualizado
function getNFTsWithInventory() {
  let inventory: Record<string, number> = {}

  try {
    const stored = localStorage.getItem('kurio-inventory')
    inventory = stored ? JSON.parse(stored) : {}
  } catch {
    inventory = {}
  }

  return mockNFTs.map((nft) => ({
    ...nft,
    availableEditions:
      inventory[nft.id] ?? nft.availableEditions,
  }))
}

export const nftHandlers = [
  // Listar NFTs
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)
    const tab = url.searchParams.get('tab') ?? 'all'

    const search =
      url.searchParams.get('search')?.toLowerCase().trim() ?? ''

    const category = url.searchParams.get('category') ?? ''
    const sort = url.searchParams.get('sort') ?? 'newest'

    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')

    const page = Math.max(
      1,
      Number(url.searchParams.get('page') ?? 1),
    )

    const limit = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get('limit') ?? 6)),
    )

    // Agora utiliza o estoque atualizado
    let results = getNFTsWithInventory()

    // Pesquisa por nome, coleção ou criador
    if (search) {
      results = results.filter((nft) =>
        `${nft.name} ${nft.collection} ${nft.creator}`
          .toLowerCase()
          .includes(search),
      )
    }

    // Categoria
    if (category) {
      results = results.filter(
        (nft) => nft.category === category,
      )
    }

    // Preço mínimo
    if (minPrice !== null && minPrice !== '') {
      results = results.filter((nft) =>
        new Decimal(nft.price).gte(minPrice),
      )
    }

    // Preço máximo
    if (maxPrice !== null && maxPrice !== '') {
      results = results.filter((nft) =>
        new Decimal(nft.price).lte(maxPrice),
      )
    }

    // Filtros especiais das abas
    if (tab === 'new-releases') {
      // Primeiro, encontra os 3 NFTs mais recentes
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )

      results = results.slice(0, 3)

      // Entre os 3 mais recentes, coloca os mais caros primeiro
      results.sort((a, b) =>
        new Decimal(b.price).comparedTo(new Decimal(a.price)),
      )
    } else if (tab === 'trending') {
      // Maior quantidade disponível primeiro
      results.sort(
        (a, b) =>
          b.availableEditions - a.availableEditions ||
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
    } else {
      // Ordenação normal do catálogo
      if (sort === 'price-asc') {
        results.sort((a, b) =>
          new Decimal(a.price).comparedTo(new Decimal(b.price)),
        )
      } else if (sort === 'price-desc') {
        results.sort((a, b) =>
          new Decimal(b.price).comparedTo(new Decimal(a.price)),
        )
      } else {
        results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )
      }
    }

    // Paginação
    const total = results.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit

    return HttpResponse.json({
      items: results.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages,
    })
  }),

  // Buscar NFT por ID
  http.get('/api/nfts/:id', ({ params }) => {
    const nfts = getNFTsWithInventory()

    const nft = nfts.find(
      (item) => item.id === params.id,
    )

    if (!nft) {
      return HttpResponse.json(
        { message: 'NFT não encontrado.' },
        { status: 404 },
      )
    }

    return HttpResponse.json(nft)
  }),
]
