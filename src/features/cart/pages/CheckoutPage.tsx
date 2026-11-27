
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import Decimal from 'decimal.js'
import { ArrowLeft } from 'lucide-react'

import { useFooterVisibility } from '../../../components/shared/FooterVisibilityContext'

import { useCart } from '../hooks/useCart'
import { cartService } from '../services/cart.service'
import type { Order, PaymentMethod } from '../types/order'
import type { CollectorDetails } from '../types/checkout'

import { useAuth } from '../../account/hooks/useAuth'
import { useWallets } from '../../account/hooks/useWallets'

import { CheckoutForm } from '../components/CheckoutForm'
import { CheckoutOrderSummary } from '../components/CheckoutOrderSummary'
import { CollectorProfileForm } from '../components/CollectorProfileForm'
import { WalletDetailsForm } from '../components/WalletDetailsForm'
import { EmptyCart } from '../components/EmptyCart'
import { OrderConfirmation } from '../components/OrderConfirmation'

const NETWORK_FEE = new Decimal('0.015')

const COUPONS: Record<string, number> = {
  KURIO10: 10,
  KURIO20: 20,
}

function getValidSavedCoupon(): string | null {
  const code = sessionStorage.getItem('kurio-checkout-coupon')
  return code && COUPONS[code] ? code : null
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const setFooterHidden = useFooterVisibility()

  const { user } = useAuth()
  const { data: cart, isLoading, isError } = useCart()

  const {
    wallets,
    isLoading: isWalletsLoading,
  } = useWallets(!!user, user?.id)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [appliedCoupon] = useState<string | null>(getValidSavedCoupon)
  const [selectedWalletId, setSelectedWalletId] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  const [collector, setCollector] = useState<CollectorDetails>({
    displayName: user?.name ?? '',
    username: '',
    email: user?.email ?? '',
    network: 'Ethereum',
    walletAddress: '',
    walletType: 'metamask',
    ensName: '',
    referralCode: '',
    note: '',
  })

  // Oculta o footer somente na confirmação do pedido.
  useEffect(() => {
    setFooterHidden(!!order)

    return () => {
      setFooterHidden(false)
    }
  }, [order, setFooterHidden])

  const items = cart?.items ?? []

  const subtotal = items.reduce(
    (sum, item) =>
      sum.plus(new Decimal(item.nft.price).mul(item.quantity)),
    new Decimal(0),
  )

  const discountPercentage = appliedCoupon
    ? COUPONS[appliedCoupon] ?? 0
    : 0

  const discount = subtotal.mul(discountPercentage).div(100)

  const networkFee =
    items.length > 0 ? NETWORK_FEE : new Decimal(0)

  const total = Decimal.max(
    subtotal.minus(discount).plus(networkFee),
    0,
  )

  const checkoutMutation = useMutation({
    mutationFn: () =>
      cartService.checkout({
        paymentMethod,
        ...(appliedCoupon ? { couponCode: appliedCoupon } : {}),
        ...(paymentMethod === 'wallet'
          ? { walletId: selectedWalletId }
          : {}),
      }),

    onSuccess: (data) => {
      setOrder(data)
      setCheckoutError('')

      sessionStorage.removeItem('kurio-checkout-coupon')

      queryClient.setQueryData(['cart', user?.id ?? 'guest'], {
        items: [],
        totalItems: 0,
      })

      queryClient.invalidateQueries({ queryKey: ['nfts'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      setCheckoutError(
        message ?? 'Não foi possível finalizar sua compra.',
      )
    },
  })

  function updateCollector(
    field: keyof CollectorDetails,
    value: string,
  ) {
    setCollector((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCheckout() {
    setCheckoutError('')

    if (!collector.displayName.trim()) {
      setCheckoutError('Informe seu nome de exibição.')
      return
    }

    if (!collector.username.trim()) {
      setCheckoutError('Informe seu nome de usuário.')
      return
    }

    if (!collector.email.trim()) {
      setCheckoutError('Informe seu e-mail.')
      return
    }

    if (paymentMethod === 'wallet') {
      if (wallets.length === 0) {
        setCheckoutError(
          'Você precisa cadastrar uma carteira na sua conta antes de continuar.',
        )
        return
      }

      if (!selectedWalletId) {
        setCheckoutError('Selecione uma carteira para continuar.')
        return
      }
    }

    checkoutMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#100d0b] px-6 py-16 text-center text-[#f0e5d5]">
        Carregando checkout...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#100d0b] px-6 py-16 text-center text-[#f0e5d5]">
        Não foi possível carregar seu carrinho.
      </div>
    )
  }

  if (order) {
    return (
      <div className="min-h-screen bg-[#100d0b] px-6 py-16 text-[#f0e5d5]">
        <OrderConfirmation order={order} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#100d0b] px-6 py-16 text-center text-[#f0e5d5]">
        <div className="mx-auto max-w-4xl">
          <EmptyCart />

          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="mt-6 text-sm text-[#e9a45b] underline"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#100d0b] px-6 py-10 text-[#f0e5d5]">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate({ to: '/cart' })}
          className="mb-8 flex items-center gap-2 text-sm text-[#b9a895] transition hover:text-[#e9a45b]"
        >
          <ArrowLeft size={17} />
          Voltar ao carrinho
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-bold">Finalizar compra</h1>
          <p className="mt-2 text-sm text-[#b9a895]">
            Complete seus dados para continuar com a compra.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-8">
            <CollectorProfileForm
              value={collector}
              onChange={updateCollector}
            />

            <WalletDetailsForm
              wallets={wallets}
              selectedWalletId={selectedWalletId}
              onSelect={(walletId) => {
                setSelectedWalletId(walletId)
                setCheckoutError('')
              }}
              isLoading={isWalletsLoading}
              isRequired={paymentMethod === 'wallet'}
            />
          </section>

          <aside className="h-fit space-y-6 rounded-lg border border-[#35251b] bg-[#1c140f] p-6 sm:p-7">
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal.toFixed(2)}
              discount={discount.toFixed(2)}
              networkFee={networkFee.toFixed(3)}
              total={total.toFixed(3)}
              appliedCoupon={appliedCoupon}
            />

            <div className="border-t border-[#493326] pt-5">
              <h3 className="mb-4 font-bold">Carteira e rede</h3>

              <p className="mb-4 text-xs text-[#8f7d6c]">
                Escolha sua forma de pagamento simulada.
              </p>

              <CheckoutForm
                paymentMethod={paymentMethod}
                onPaymentMethodChange={(method) => {
                  setPaymentMethod(method)
                  setCheckoutError('')
                }}
                onConfirm={handleCheckout}
                onCancel={() => navigate({ to: '/cart' })}
                isProcessing={checkoutMutation.isPending}
                error={checkoutError}
              />
            </div>

            <p className="text-center text-xs text-[#806d5c]">
              Pagamento, carteira e taxas exclusivamente simulados.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
