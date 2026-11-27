import Decimal from 'decimal.js'
import type { CartItem } from '../types/cart'

interface CheckoutOrderSummaryProps {
  items: CartItem[]
  subtotal: string
  discount: string
  networkFee: string
  total: string
  appliedCoupon: string | null
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  discount,
  networkFee,
  total,
  appliedCoupon,
}: CheckoutOrderSummaryProps) {
  return (
    <section className="min-w-0 rounded-lg border border-[#35251b] bg-[#1c140f] p-4 sm:p-7">
      <h2 className="mb-5 text-lg font-bold">Seus NFTs</h2>

      <div className="mb-5 space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-[#493326] pb-2 text-xs text-[#b9a895]">
          <span>NFTs</span>
          <span>Subtotal</span>
        </div>

        {items.map((item) => (
          <div
            key={item.nft.id}
            className="flex min-w-0 items-center justify-between gap-2 rounded bg-[#100d0b] p-2 sm:gap-3 sm:p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={item.nft.image}
                alt={item.nft.name}
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold sm:text-sm">{item.nft.name}</p>
                <p className="text-xs text-[#8f7d6c]">{item.quantity} unidade(s)</p>
              </div>
            </div>
            <span className="shrink-0 whitespace-nowrap text-xs font-bold text-[#e9a45b] sm:text-sm">
              {new Decimal(item.nft.price).mul(item.quantity).toFixed(2)} ETH
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-[#493326] pt-4 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs text-[#b9a895] sm:text-sm">
          <span>Subtotal</span>
          <span className="whitespace-nowrap text-right tabular-nums">{subtotal} ETH</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs text-[#b9a895] sm:text-sm">
          <span>Desconto {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
          <span className="whitespace-nowrap text-right tabular-nums text-[#b8d69b]">(-) {discount} ETH</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs text-[#b9a895] sm:text-sm">
          <span>Taxa de rede</span>
          <span className="whitespace-nowrap text-right tabular-nums">{networkFee} ETH</span>
        </div>
        <p className="text-right text-xs text-[#8f7d6c]">Taxa estimada</p>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 border-t border-[#493326] pt-4">
        <span className="text-sm font-bold sm:text-base">Total</span>
        <span className="whitespace-nowrap text-right text-base font-bold tabular-nums text-[#e9a45b] sm:text-xl">{total} ETH</span>
      </div>

      {appliedCoupon && (
        <p className="mt-3 text-xs text-[#b8d69b]">
          <span className="font-semibold">{appliedCoupon}</span> aplicado no carrinho.
        </p>
      )}
    </section>
  )
}
