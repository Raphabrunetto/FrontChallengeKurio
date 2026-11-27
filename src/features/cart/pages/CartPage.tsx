
import { useState } from 'react'
import axios from 'axios'
import Decimal from 'decimal.js'
import { Trash2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { useCart } from '../hooks/useCart'

import { CartHeader } from '../components/CartHeader'
import { CartItemCard } from '../components/CartItemCard'
import { CartSummary } from '../components/CartSummary'
import { EmptyCart } from '../components/EmptyCart'

const COUPONS: Record<string, number> = {
  KURIO10: 10,
  KURIO20: 20,
}

function getSavedCoupon(): string | null {
  const savedCoupon = sessionStorage.getItem('kurio-checkout-coupon')

  if (savedCoupon && COUPONS[savedCoupon]) {
    return savedCoupon
  }

  sessionStorage.removeItem('kurio-checkout-coupon')
  return null
}

export function CartPage() {
  const navigate = useNavigate()

  const {
    data: cart,
    isLoading,
    isError,
    updateItem,
    removeItem,
    clearCart,
    isUpdating,
  } = useCart()

  const [cartError, setCartError] = useState('')

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(
    getSavedCoupon,
  )

  const [couponInput, setCouponInput] = useState<string>(
    () => getSavedCoupon() ?? '',
  )

  const [couponMessage, setCouponMessage] = useState('')

  const items = cart?.items ?? []

  const subtotal = items.reduce((sum, item) => {
    return sum.plus(
      new Decimal(item.nft.price).mul(item.quantity),
    )
  }, new Decimal(0))

  const discountPercentage = appliedCoupon
    ? COUPONS[appliedCoupon] ?? 0
    : 0

  const discount = subtotal
    .mul(discountPercentage)
    .div(100)

  const networkFee = items.length > 0
    ? new Decimal('0.015')
    : new Decimal(0)

  const total = Decimal.max(
    subtotal.minus(discount).plus(networkFee),
    0,
  )

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase()

    if (!code) {
      setCouponMessage('Digite um código de cupom.')
      return
    }

    if (!COUPONS[code]) {
      setAppliedCoupon(null)
      sessionStorage.removeItem('kurio-checkout-coupon')
      setCouponMessage('Cupom inválido ou expirado.')
      return
    }

    sessionStorage.setItem('kurio-checkout-coupon', code)

    setAppliedCoupon(code)
    setCouponInput(code)
    setCouponMessage(`Cupom ${code} aplicado com sucesso!`)
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponMessage('')

    sessionStorage.removeItem('kurio-checkout-coupon')
  }

  function handleCouponInputChange(value: string) {
    setCouponInput(value)
    setCouponMessage('')

    if (appliedCoupon) {
      setAppliedCoupon(null)
      sessionStorage.removeItem('kurio-checkout-coupon')
    }
  }

  async function handleIncrease(nftId: string) {
    const item = items.find(
      (cartItem) => cartItem.nft.id === nftId,
    )

    if (!item) return

    setCartError('')

    try {
      await updateItem({
        nftId,
        quantity: item.quantity + 1,
      })
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      setCartError(
        message ?? 'Não foi possível atualizar a quantidade.',
      )
    }
  }

  async function handleDecrease(nftId: string, quantity: number) {
    if (quantity < 1) return

    setCartError('')

    try {
      await updateItem({ nftId, quantity })
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      setCartError(
        message ?? 'Não foi possível atualizar a quantidade.',
      )
    }
  }

  async function handleRemove(nftId: string) {
    setCartError('')

    try {
      await removeItem(nftId)
    } catch {
      setCartError('Não foi possível remover esse NFT.')
    }
  }

  async function handleClearCart() {
    setCartError('')

    try {
      await clearCart()
      handleRemoveCoupon()
    } catch {
      setCartError('Não foi possível limpar o carrinho.')
    }
  }

  function handleCheckout() {
    if (items.length === 0) return

    // Garante que o cupom aplicado esteja salvo antes da navegação.
    if (appliedCoupon) {
      sessionStorage.setItem('kurio-checkout-coupon', appliedCoupon)
    }

    navigate({ to: '/checkout' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#100d0b] px-6 py-16 text-center text-[#f0e5d5]">
        Carregando carrinho...
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

  return (
    <div className="min-h-screen bg-[#100d0b] px-6 py-10 text-[#f0e5d5]">
      <div className="mx-auto max-w-6xl">
        <CartHeader totalItems={cart?.totalItems ?? 0} />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="space-y-4">
              {cartError && (
                <p
                  role="alert"
                  className="rounded border border-[#8f4939] bg-[#3a2018] p-3 text-sm text-[#e5a18a]"
                >
                  {cartError}
                </p>
              )}

              {items.map((item) => (
                <CartItemCard
                  key={item.nft.id}
                  item={item}
                  onRemove={handleRemove}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  isUpdating={isUpdating}
                />
              ))}

              <button
                type="button"
                onClick={handleClearCart}
                disabled={isUpdating}
                className="group mt-2 inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-2 text-sm text-[#b9a895] transition-all duration-200 hover:border-[#8f4939]/50 hover:bg-[#3a2018]/50 hover:text-[#e5a18a] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a18a]/60 disabled:opacity-40"
              >
                <Trash2 size={14} className="transition-transform duration-200 group-hover:scale-110" />
                Limpar carrinho
              </button>
            </section>

            <aside className="h-fit rounded-lg border border-[#35251b] bg-[#1c140f] p-7">
              <h2 className="mb-6 text-lg font-bold">
                Resumo do pedido
              </h2>

              <CartSummary
                totalItems={cart?.totalItems ?? 0}
                subtotal={subtotal.toFixed(2)}
                discount={discount.toFixed(2)}
                networkFee={networkFee.toFixed(3)}
                total={total.toFixed(3)}
                couponInput={couponInput}
                appliedCoupon={appliedCoupon}
                couponMessage={couponMessage}
                onCouponInputChange={handleCouponInputChange}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded bg-[#d99045] px-5 py-4 text-sm font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
              >
                Ir para checkout
              </button>

              <p className="mt-3 text-center text-xs text-[#8f7d6c]">
                Pagamentos e taxas exclusivamente simulados.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
