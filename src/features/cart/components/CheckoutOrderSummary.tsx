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
    <section className="rounded-lg border border-[#35251b] bg-[#1c140f] p-6 sm:p-7">
      <h2 className="mb-5 text-lg font-bold">Seus NFTs</h2>

      <div className="mb-5 space-y-3">
        <div className="grid grid-cols-[1fr_auto] border-b border-[#493326] pb-2 text-xs text-[#b9a895]">
          <span>NFTs</span>
          <span>Subtotal</span>
        </div>

        {items.map((item) => (
          <div
            key={item.nft.id}
            className="flex items-center justify-between gap-3 rounded bg-[#100d0b] p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={item.nft.image}
                alt={item.nft.name}
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.nft.name}</p>
                <p className="text-xs text-[#8f7d6c]">{item.quantity} unidade(s)</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-bold text-[#e9a45b]">
              {new Decimal(item.nft.price).mul(item.quantity).toFixed(2)} ETH
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-[#493326] pt-4 text-sm">
        <div className="flex justify-between text-[#b9a895]">
          <span>Subtotal</span>
          <span>{subtotal} ETH</span>
        </div>
        <div className="flex justify-between text-[#b9a895]">
          <span>Desconto {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
          <span className="text-[#b8d69b]">(-) {discount} ETH</span>
        </div>
        <div className="flex justify-between text-[#b9a895]">
          <span>Taxa de rede</span>
          <span>{networkFee} ETH</span>
        </div>
        <p className="text-right text-xs text-[#8f7d6c]">Taxa estimada</p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#493326] pt-4">
        <span className="font-bold">Total</span>
        <span className="text-xl font-bold text-[#e9a45b]">{total} ETH</span>
      </div>

      {appliedCoupon && (
        <p className="mt-3 text-xs text-[#b8d69b]">
          <span className="font-semibold">{appliedCoupon}</span> aplicado no carrinho.
        </p>
      )}
    </section>
  )
}
