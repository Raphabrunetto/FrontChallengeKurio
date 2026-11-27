
import { Router } from 'express'
import Decimal from 'decimal.js'
import { updateNFT } from '../store.js'
import { emitNFTUpdated } from '../socket.js'

export function createDevRouter(io) {
  const router = Router()

  router.post('/nfts/:id/update', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ message: 'Not found' })
    }

    const { price, availableEditions } = req.body
    const changes = {}

    if (price !== undefined) {
      try {
        if (!new Decimal(price).isFinite() || new Decimal(price).lte(0)) {
          return res.status(400).json({ message: 'Preço inválido.' })
        }

        changes.price = String(price)
      } catch {
        return res.status(400).json({ message: 'Preço inválido.' })
      }
    }

    if (availableEditions !== undefined) {
      if (
        !Number.isInteger(availableEditions) ||
        availableEditions < 0
      ) {
        return res.status(400).json({ message: 'Estoque inválido.' })
      }

      changes.availableEditions = availableEditions
    }

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({
        message: 'Informe price ou availableEditions.',
      })
    }

    const nft = updateNFT(req.params.id, changes)

    if (!nft) {
      return res.status(404).json({ message: 'NFT não encontrado.' })
    }

    emitNFTUpdated(io, nft)

    return res.json({
      message: 'NFT atualizado.',
      nft,
    })
  })

  return router
}
