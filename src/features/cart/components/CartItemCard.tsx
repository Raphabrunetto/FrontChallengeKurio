
import { Trash2, Minus, Plus } from 'lucide-react'
import Decimal from 'decimal.js'
import type { CartItem } from '../types/cart'

interface CartItemCardProps {
  item: CartItem
  onRemove: (nftId: string) => void
  onIncrease: (nftId: string) => void
  onDecrease: (nftId: string, quantity: number) => void
  isUpdating?: boolean
}

export function CartItemCard({
  item,
  onRemove,
  onIncrease,
  onDecrease,
  isUpdating = false,
}: CartItemCardProps) {
  const { nft, quantity } = item

  const subtotal = new Decimal(nft.price)
    .mul(quantity)
    .toFixed(2)

  const reachedStockLimit = quantity >= nft.availableEditions

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[#35251b] bg-[#1c140f] p-4 sm:flex-row sm:items-center">
      <img
        src={nft.image}
        alt={nft.name}
        loading="lazy"
        decoding="async"
        className="h-36 w-full rounded object-cover sm:h-28 sm:w-28"
      />

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs uppercase tracking-wider text-[#d99045]">
          {nft.collection}
        </p>

        <h2 className="break-words text-lg font-bold">
          {nft.name}
        </h2>

        <p className="mt-1 text-sm text-[#b9a895]">
          {nft.price} ETH por unidade
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded border border-[#493326]">
            <button
              type="button"
              onClick={() => onDecrease(nft.id, quantity - 1)}
              disabled={isUpdating}
              aria-label={`Diminuir quantidade de ${nft.name}`}
              className="flex h-9 w-9 items-center justify-center text-[#d9c5b0] transition hover:bg-[#3a2018] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={15} />
            </button>

            <span className="min-w-9 text-center text-sm font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrease(nft.id)}
              disabled={isUpdating || reachedStockLimit}
              aria-label={`Aumentar quantidade de ${nft.name}`}
              title={reachedStockLimit ? 'Limite de estoque atingido' : 'Aumentar quantidade'}
              className="flex h-9 w-9 items-center justify-center text-[#d9c5b0] transition hover:bg-[#3a2018] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={15} />
            </button>
          </div>

          <span className="text-xs text-[#8f7d6c]">
            {nft.availableEditions} disponíveis no catálogo
          </span>
        </div>

        <p className="mt-3 font-bold text-[#e9a45b]">
          Subtotal: {subtotal} ETH
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(nft.id)}
        disabled={isUpdating}
        title="Remover NFT do carrinho"
        aria-label={`Remover ${nft.name} do carrinho`}
        className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded text-[#9b7965] transition hover:bg-[#3a2018] hover:text-[#e5a18a] disabled:cursor-not-allowed disabled:opacity-40 sm:self-center"
      >
        <Trash2 size={18} />
      </button>
    </article>
  )
}
