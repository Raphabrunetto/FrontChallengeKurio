
import { Router } from 'express'
import { nfts } from '../store.js'

const router = Router()

router.get('/', (req, res) => {
  const items = [...nfts.values()]
  const search = String(req.query.search ?? '').toLowerCase()
  const category = String(req.query.category ?? '')
  const page = Math.max(1, Number(req.query.page ?? 1))
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 6)))

  let results = items.filter((nft) => {
    const matchesSearch = !search ||
      `${nft.name} ${nft.collection} ${nft.creator}`
        .toLowerCase()
        .includes(search)

    const matchesCategory = !category || nft.category === category

    return matchesSearch && matchesCategory
  })

  const sort = String(req.query.sort ?? 'newest')

  if (sort === 'price-asc') {
    results.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sort === 'price-desc') {
    results.sort((a, b) => Number(b.price) - Number(a.price))
  } else {
    results.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )
  }

  const total = results.length

  res.json({
    items: results.slice((page - 1) * limit, page * limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
})

router.get('/:id', (req, res) => {
  const nft = nfts.get(req.params.id)

  if (!nft) {
    return res.status(404).json({ message: 'NFT não encontrado.' })
  }

  res.json(nft)
})

export default router
