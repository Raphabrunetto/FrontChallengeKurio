
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useNFTs } from '../hooks/useNFTs'

const categories = [
  { name: 'Arte digital', value: 'Art' },
  { name: 'Arte abstrata', value: 'Abstract' },
  { name: 'Personagens', value: 'Characters' },
]

const networks = [
  { name: 'Ethereum', count: 119 },
  { name: 'Polygon', count: 78 },
  { name: 'Solana', count: 86 },
]

interface CatalogSidebarProps {
  selectedCategory: string
  minPriceInput: string
  maxPriceInput: string
  priceError: string
  onCategoryChange: (category: string) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onApplyPrice: () => void
  onClearFilters: () => void
}

export function CatalogSidebar({
  selectedCategory,
  minPriceInput,
  maxPriceInput,
  priceError,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
  onClearFilters,
}: CatalogSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const { data: nftData, isLoading: isLoadingFeatured } = useNFTs({
    limit: 50,
    sort: 'newest',
  })

  const featuredNFT = nftData?.items
    ?.filter((nft) => nft.featured)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )[0]

  return (
    <aside className="min-w-0">
      {/* BOTÃO DE FILTROS MOBILE */}
      <button
        type="button"
        onClick={() => setIsMobileOpen((open) => !open)}
        aria-expanded={isMobileOpen}
        className="flex w-full items-center justify-between rounded-lg border border-[#704b30] bg-[#211711] p-4 text-sm font-semibold text-[#eee3d2] md:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          Filtros
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${isMobileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* CONTEÚDO DOS FILTROS */}
      <div
        className={`${isMobileOpen ? 'mt-3 block' : 'hidden'} space-y-7 rounded-lg bg-[#211711] p-5 md:mt-0 md:block`}
      >
        {/* CATEGORIAS */}
        <div>
          <h2 className="mb-4 text-sm font-semibold">
            Coleções
          </h2>

          <ul className="space-y-3">
            <li>
              <button
                type="button"
                onClick={() => onCategoryChange('')}
                aria-pressed={selectedCategory === ''}
                className={`flex w-full items-center justify-between text-left text-[11px] transition hover:text-[#d99045] ${
                  selectedCategory === ''
                    ? 'font-bold text-[#d99045]'
                    : 'text-[#b9a184]'
                }`}
              >
                Todas as categorias
                {selectedCategory === '' && <span>✓</span>}
              </button>
            </li>

            {categories.map((category) => (
              <li key={category.value}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.value)}
                  aria-pressed={selectedCategory === category.value}
                  className={`flex w-full items-center justify-between text-left text-[11px] transition hover:text-[#d99045] ${
                    selectedCategory === category.value
                      ? 'font-bold text-[#d99045]'
                      : 'text-[#b9a184]'
                  }`}
                >
                  <span>{category.name}</span>

                  {selectedCategory === category.value && (
                    <span>✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* FAIXA DE PREÇO */}
        <div>
          <h3 className="mb-4 text-sm font-semibold">
            Faixa de preço
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="min-price"
                className="mb-1 block text-[10px] text-[#b9a184]"
              >
                Mínimo
              </label>

              <input
                id="min-price"
                type="number"
                min="0"
                step="0.01"
                value={minPriceInput}
                onChange={(event) => onMinPriceChange(event.target.value)}
                placeholder="0.00"
                className="w-full min-w-0 rounded border border-[#704b30] bg-[#100d0b] px-2 py-2 text-xs text-[#eee3d2] outline-none focus:border-[#d99045]"
              />
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="mb-1 block text-[10px] text-[#b9a184]"
              >
                Máximo
              </label>

              <input
                id="max-price"
                type="number"
                min="0"
                step="0.01"
                value={maxPriceInput}
                onChange={(event) => onMaxPriceChange(event.target.value)}
                placeholder="12.30"
                className="w-full min-w-0 rounded border border-[#704b30] bg-[#100d0b] px-2 py-2 text-xs text-[#eee3d2] outline-none focus:border-[#d99045]"
              />
            </div>
          </div>

          {priceError && (
            <p className="mt-2 text-[10px] text-red-400">
              {priceError}
            </p>
          )}

          <button
            type="button"
            onClick={onApplyPrice}
            className="mt-3 rounded bg-[#d99045] px-4 py-2 text-[10px] font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
          >
            Aplicar
          </button>
        </div>

        {/* REDES */}
        <div>
          <h3 className="mb-4 text-sm font-semibold">
            Rede
          </h3>

          <ul className="space-y-3">
            {networks.map((network) => (
              <li
                key={network.name}
                className="flex justify-between text-[11px] text-[#b9a184]"
              >
                <span>{network.name}</span>

                <span className="text-[#d99045]">
                  ({network.count})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* NFT EM DESTAQUE */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">
            NFT em destaque
          </h3>

          {isLoadingFeatured ? (
            <div className="aspect-square w-full animate-pulse rounded-lg bg-[#302117]" />
          ) : featuredNFT ? (
            <Link
              to="/nft/$nftId"
              params={{ nftId: featuredNFT.id }}
              className="group block overflow-hidden rounded-lg border border-[#49301f] bg-[#100d0b]"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={featuredNFT.image}
                  alt={`${featuredNFT.name}, NFT em destaque`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <h4 className="truncate text-xs font-bold text-[#eee3d2] transition group-hover:text-[#d99045]">
                  {featuredNFT.name}
                </h4>

                <p className="mt-1 truncate text-[10px] text-[#a9957d]">
                  {featuredNFT.collection}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d99045]">
                    {featuredNFT.price} ETH
                  </span>

                  <span className="text-[10px] text-[#b9a184]">
                    Ver NFT →
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-xs text-[#a9957d]">
              Nenhum NFT em destaque disponível.
            </p>
          )}
        </div>

        {/* LIMPAR FILTROS */}
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full rounded border border-[#704b30] px-3 py-2 text-[11px] text-[#b9a184] transition hover:border-[#d99045] hover:text-[#d99045]"
        >
          Limpar filtros
        </button>
      </div>
    </aside>
  )
}
