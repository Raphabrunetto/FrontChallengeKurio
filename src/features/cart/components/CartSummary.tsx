
import { Tag, X } from 'lucide-react'

interface CartSummaryProps {
  totalItems: number
  subtotal: string
  discount: string
  networkFee: string
  total: string
  couponInput: string
  appliedCoupon: string | null
  couponMessage: string
  onCouponInputChange: (value: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
}

export function CartSummary({
  totalItems,
  subtotal,
  discount,
  networkFee,
  total,
  couponInput,
  appliedCoupon,
  couponMessage,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  return (
    <div className="mb-6 min-w-0 rounded-lg bg-[#100d0b] p-3 sm:p-4">
      <div className="mb-5">
        <label
          htmlFor="coupon"
          className="mb-2 flex items-center gap-2 text-sm font-semibold"
        >
          <Tag size={15} className="text-[#d99045]" />
          Cupom de desconto
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-3 rounded border border-[#526b43] bg-[#1b2918] p-3">
            <div>
              <p className="text-sm font-bold text-[#b8d69b]">
                {appliedCoupon}
              </p>
              <p className="text-xs text-[#a6b997]">
                Cupom aplicado com sucesso
              </p>
            </div>

            <button
              type="button"
              onClick={onRemoveCoupon}
              aria-label="Remover cupom"
              className="text-[#b8d69b] transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 gap-2">
            <input
              id="coupon"
              value={couponInput}
              onChange={(event) => onCouponInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  onApplyCoupon()
                }
              }}
              placeholder="Digite seu cupom"
              className="min-w-0 flex-1 rounded border border-[#493326] bg-[#1c140f] px-2 py-2 text-xs text-[#eee3d2] outline-none placeholder:text-[#806d5c] focus:border-[#d99045] sm:px-3 sm:text-sm"
            />

            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={!couponInput.trim()}
              className="shrink-0 whitespace-nowrap rounded bg-[#493326] px-2 py-2 text-[10px] font-bold text-[#f0e5d5] transition hover:bg-[#65452f] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-xs"
            >
              Aplicar
            </button>
          </div>
        )}

        {couponMessage && (
          <p
            role="status"
            className="mt-2 text-xs text-[#e5a18a]"
          >
            {couponMessage}
          </p>
        )}
      </div>

      <div className="space-y-3 border-t border-[#493326] pt-4 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 text-xs text-[#b9a895] sm:text-sm">
          <span className="min-w-0">Quantidade de itens</span>
          <span className="text-right tabular-nums">{totalItems}</span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 text-xs text-[#b9a895] sm:text-sm">
          <span>Subtotal</span>
          <span className="whitespace-nowrap text-right tabular-nums">{subtotal} ETH</span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 text-xs text-[#b9a895] sm:text-sm">
          <span>Desconto</span>
          <span className="whitespace-nowrap text-right tabular-nums text-[#b8d69b]">
            - {discount} ETH
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 text-xs text-[#b9a895] sm:text-sm">
          <span>Taxa de rede estimada</span>
          <span className="whitespace-nowrap text-right tabular-nums">{networkFee} ETH</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 border-t border-[#493326] pt-5">
        <span className="min-w-0 text-sm font-bold sm:text-base">Total estimado</span>

        <span className="whitespace-nowrap text-right text-base font-bold tabular-nums text-[#e9a45b] sm:text-xl">
          {total} ETH
        </span>
      </div>

      <p className="mt-3 break-words text-[10px] leading-relaxed text-[#806d5c] sm:text-xs">
        Valores simulados para fins demonstrativos.
      </p>
    </div>
  )
}
