
import { SlidersHorizontal } from 'lucide-react'
import type { NFTListParams } from '../types/nft'

interface CatalogToolbarProps {
  sort: NFTListParams['sort']
  tab: NFTListParams['tab']
  onSortChange: (sort: NFTListParams['sort']) => void
  onTabChange: (tab: NFTListParams['tab']) => void
}

export function CatalogToolbar({
  sort,
  tab,
  onSortChange,
  onTabChange,
}: CatalogToolbarProps) {
  const tabs = [
    { id: 'all', label: 'Todos os NFTs' },
    { id: 'new-releases', label: 'Novos lançamentos' },
    { id: 'trending', label: 'Em alta' },
  ] as const

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`border-b-2 pb-2 text-xs transition ${
              tab === item.id
                ? 'border-[#d99045] font-semibold text-[#d99045]'
                : 'border-transparent text-[#b9a184] hover:text-[#e9a45b]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#b9a184]">
        <SlidersHorizontal size={14} className="shrink-0" />

        <label htmlFor="sort-nfts" className="shrink-0">
          Ordenar por:
        </label>

        <select
          id="sort-nfts"
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as NFTListParams['sort'])
          }
          className="min-w-0 flex-1 cursor-pointer bg-transparent text-[#b9a184] outline-none hover:text-[#d99045] sm:flex-none"
        >
          <option value="newest" className="bg-[#211711]">
            Listados recentemente
          </option>
          <option value="price-asc" className="bg-[#211711]">
            Menor preço
          </option>
          <option value="price-desc" className="bg-[#211711]">
            Maior preço
          </option>
        </select>
      </div>
    </div>
  )
}
