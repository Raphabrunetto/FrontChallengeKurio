
import { Link } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import Decimal from 'decimal.js'
import type { Order } from '../types/order'

interface OrderConfirmationProps {
  order: Order
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const paymentLabel =
    order.paymentMethod === 'pix'
      ? 'PIX (simulado)'
      : 'Carteira digital (fictícia)'

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-[#35251b] bg-[#1c140f] p-6 sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <CheckCircle2 size={56} className="mb-4 text-[#d99045]" />

        <h1 className="text-2xl font-bold">
          Compra realizada!
        </h1>

        <p className="mt-2 text-sm text-[#b9a895]">
          Seu pedido foi processado com sucesso.
        </p>
      </div>

      <div className="mb-6 space-y-3 rounded-lg bg-[#100d0b] p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[#b9a895]">Pedido</span>
          <span className="font-medium">{order.id}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[#b9a895]">Pagamento</span>
          <span className="text-right">{paymentLabel}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[#b9a895]">Data</span>
          <span>
            {new Date(order.createdAt).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      <h2 className="mb-3 font-bold">NFTs adquiridos</h2>

      <div className="mb-6 space-y-3">
        {order.items.map((item) => (
          <div
            key={item.nft.id}
            className="flex items-center gap-3 rounded-lg border border-[#35251b] p-3"
          >
            <img
              src={item.nft.image}
              alt={item.nft.name}
              loading="lazy"
              decoding="async"
              className="h-16 w-16 rounded object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{item.nft.name}</p>
              <p className="text-xs text-[#b9a895]">
                {item.quantity} unidade(s)
              </p>
            </div>

            <span className="shrink-0 text-sm font-medium text-[#e9a45b]">
              {new Decimal(item.unitPrice).mul(item.quantity).toFixed(2)} ETH
            </span>
          </div>
        ))}
      </div>

      <div className="mb-8 space-y-3 rounded-lg bg-[#100d0b] p-4 text-sm">
        <div className="flex justify-between gap-4 text-[#b9a895]">
          <span>Subtotal</span>
          <span>{order.subtotal} ETH</span>
        </div>

        {order.couponCode && (
          <div className="flex justify-between gap-4 text-[#b9a895]">
            <span>Cupom ({order.couponCode})</span>
            <span className="text-[#b8d69b]">
              Aplicado
            </span>
          </div>
        )}

        <div className="flex justify-between gap-4 text-[#b9a895]">
          <span>Desconto</span>
          <span className="text-[#b8d69b]">
            - {order.discount} ETH
          </span>
        </div>

        <div className="flex justify-between gap-4 text-[#b9a895]">
          <span>Taxa de rede</span>
          <span>{order.networkFee} ETH</span>
        </div>

        <div className="flex justify-between gap-4 border-t border-[#493326] pt-4">
          <span className="font-bold">Total pago</span>
          <span className="text-lg font-bold text-[#e9a45b]">
            {new Decimal(order.total).toFixed(2)} ETH
          </span>
        </div>
      </div>

      <Link
        to="/"
        className="block rounded bg-[#d99045] px-5 py-4 text-center text-sm font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
      >
        Voltar ao marketplace
      </Link>

      <p className="mt-4 text-center text-xs text-[#9b7965]">
        Esta compra foi realizada em ambiente de simulação.
      </p>
    </div>
  )
}
