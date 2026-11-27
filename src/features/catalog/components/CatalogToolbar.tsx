
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
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
      <div className="flex min-w-0 flex-nowrap items-center gap-3 overflow-x-auto sm:gap-5">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`shrink-0 whitespace-nowrap border-b-2 pb-2 text-[11px] transition-all duration-200 hover:-translate-y-0.5 sm:text-xs ${
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

        <div className="group relative min-w-0 flex-1 sm:flex-none">
          <select
            id="sort-nfts"
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as NFTListParams['sort'])
            }
            className="w-full min-w-0 cursor-pointer appearance-none rounded-md border border-[#49301f] bg-[#211711] py-2 pl-3 pr-9 text-[11px] font-medium text-[#e9d5bb] shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d99045] hover:bg-[#2a1b12] hover:text-[#e9a45b] hover:shadow-[0_5px_16px_rgb(0_0_0_/_25%)] focus-visible:border-[#d99045] focus-visible:ring-2 focus-visible:ring-[#d99045]/50 sm:w-auto"
          >
            <option value="newest" className="bg-[#211711]">Listados recentemente</option>
            <option value="price-asc" className="bg-[#211711]">Menor preço</option>
            <option value="price-desc" className="bg-[#211711]">Maior preço</option>
          </select>
          <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#d99045] transition-transform duration-200 group-focus-within:rotate-180" />
        </div>
      </div>
    </div>
  )
}
