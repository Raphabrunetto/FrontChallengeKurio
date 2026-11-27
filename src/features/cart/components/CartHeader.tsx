
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

interface CartHeaderProps {
  totalItems: number
}

export function CartHeader({ totalItems }: CartHeaderProps) {
  return (
    <>
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 text-sm text-[#d99045] transition hover:text-[#e9a45b]"
      >
        <ArrowLeft size={16} />
        Voltar ao marketplace
      </Link>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <ShoppingCart size={28} className="text-[#d99045]" />

        <h1 className="text-2xl font-bold sm:text-3xl">
          Meu carrinho
        </h1>

        <span className="rounded-full bg-[#2a1b12] px-3 py-1 text-sm text-[#d99045]">
          {totalItems} itens
        </span>
      </div>
    </>
  )
}
