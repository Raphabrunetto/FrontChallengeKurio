
import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[#35251b] bg-[#1c140f] px-6 py-16 text-center">
      <ShoppingBag
        size={52}
        className="mb-5 text-[#d99045]"
      />

      <h2 className="mb-2 text-xl font-bold">
        Seu carrinho está vazio
      </h2>

      <p className="mb-6 max-w-sm text-sm text-[#b9a895]">
        Você ainda não adicionou nenhum NFT ao seu carrinho.
        Que tal explorar nossa coleção?
      </p>

      <Link
        to="/"
        className="rounded bg-[#d99045] px-6 py-3 text-sm font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
      >
        Explorar marketplace
      </Link>
    </div>
  )
}
