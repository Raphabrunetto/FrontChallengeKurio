
import { CreditCard, Wallet } from 'lucide-react'
import type { PaymentMethod } from '../types/order'

interface CheckoutFormProps {
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
  onConfirm: () => void
  onCancel: () => void
  isProcessing: boolean
  error: string
}

export function CheckoutForm({
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  onCancel,
  isProcessing,
  error,
}: CheckoutFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Forma de pagamento</h3>

      {/* PIX */}
      <button
        type="button"
        onClick={() => onPaymentMethodChange('pix')}
        disabled={isProcessing}
        aria-pressed={paymentMethod === 'pix'}
        className={`flex w-full items-center gap-3 rounded border p-4 text-left transition ${
          paymentMethod === 'pix'
            ? 'border-[#d99045] bg-[#2a1b12]'
            : 'border-[#493326] hover:bg-[#251a13]'
        }`}
      >
        <CreditCard size={20} className="shrink-0 text-[#d99045]" />

        <div>
          <p className="text-sm font-bold">PIX</p>
          <p className="text-xs text-[#b9a895]">
            Pagamento simulado
          </p>
        </div>
      </button>

      {/* CARTEIRA DIGITAL */}
      <button
        type="button"
        onClick={() => onPaymentMethodChange('wallet')}
        disabled={isProcessing}
        aria-pressed={paymentMethod === 'wallet'}
        className={`flex w-full items-center gap-3 rounded border p-4 text-left transition ${
          paymentMethod === 'wallet'
            ? 'border-[#d99045] bg-[#2a1b12]'
            : 'border-[#493326] hover:bg-[#251a13]'
        }`}
      >
        <Wallet size={20} className="shrink-0 text-[#d99045]" />

        <div>
          <p className="text-sm font-bold">Carteira digital</p>
          <p className="text-xs text-[#b9a895]">
            Carteira fictícia
          </p>
        </div>
      </button>

      {/* ERRO */}
      {error && (
        <p role="alert" className="text-sm text-[#e5a18a]">
          {error}
        </p>
      )}

      {/* CONFIRMAR */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={isProcessing}
        className="min-h-12 w-full rounded bg-[#d99045] px-5 py-4 text-sm font-bold text-[#170f0a] transition hover:bg-[#e9a45b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? 'Processando...' : 'Confirmar compra'}
      </button>

      {/* CANCELAR */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isProcessing}
        className="min-h-10 w-full text-sm text-[#b9a895] underline hover:text-[#e9a45b] disabled:opacity-50"
      >
        Voltar ao carrinho
      </button>
    </div>
  )
}
