
import { Link } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import type { NFT } from '../types/nft'

interface NFTGridProps {
  nfts: NFT[] | undefined
  total: number | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onClearFilters: () => void
}

export function NFTGrid({
  nfts,
  total,
  isLoading,
  isError,
  onRetry,
  onClearFilters,
}: NFTGridProps) {
  const gridClass =
    'grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3'

  return (
    <div className="min-w-0">
      {/* RESULTADOS */}
      {total !== undefined && !isLoading && !isError && (
        <p className="mb-4 text-[11px] text-[#a9957d]">
          {total} NFTs encontrados
        </p>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className={gridClass}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg bg-[#211711] p-3"
            >
              <div className="aspect-square rounded bg-[#38271d]" />
              <div className="mt-4 h-3 w-2/3 rounded bg-[#38271d]" />
              <div className="mt-3 h-3 w-1/3 rounded bg-[#38271d]" />
            </div>
          ))}
        </div>
      )}

      {/* ERRO */}
      {isError && (
        <div className="rounded-lg border border-red-900 bg-red-950/20 p-5 text-center sm:p-8">
          <p className="mb-4 text-sm text-red-300">
            Não foi possível carregar os NFTs.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-[#d99045] px-4 py-2 text-xs font-bold text-black"
          >
            <RefreshCw size={14} />
            Tentar novamente
          </button>
        </div>
      )}

      {/* LISTA VAZIA */}
      {!isLoading && !isError && nfts?.length === 0 && (
        <div className="py-10 text-center sm:py-12">
          <p className="text-sm text-[#a9957d]">
            Nenhum NFT encontrado.
          </p>

          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 min-h-10 text-xs text-[#d99045] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* CARDS */}
      {!isLoading && !isError && nfts && nfts.length > 0 && (
        <div className={gridClass}>
          {nfts.map((nft) => (
            <Link
              key={nft.id}
              to="/nft/$nftId"
              params={{ nftId: nft.id }}
              className="group block min-w-0"
            >
              <div className="overflow-hidden bg-[#211711] p-2">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="min-w-0 px-1 pt-3">
                <p className="truncate text-[10px] text-[#d99045]">
                  {nft.collection}
                </p>

                <h3 className="mt-1 break-words text-sm font-semibold text-[#eee3d2]">
                  {nft.name}
                </h3>

                <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-[10px] text-[#a9957d]">
                    {nft.creator}
                  </span>

                  <div className="shrink-0 text-right">
                    <p className="text-[9px] text-[#a9957d]">
                      Preço
                    </p>

                    <p className="text-xs font-bold text-[#d99045]">
                      {nft.price} ETH
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
