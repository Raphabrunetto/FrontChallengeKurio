import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

import type { NFT } from '../types/nft'

interface RecommendationCarouselProps {
  title: string
  nfts: NFT[]
}

const PAGE_COUNT = 3
const MINIMUM_ITEMS = 15

export function RecommendationCarousel({
  title,
  nfts,
}: RecommendationCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)

  if (nfts.length === 0) return null

  const items = Array.from(
    { length: Math.max(MINIMUM_ITEMS, nfts.length) },
    (_, index) => nfts[index % nfts.length],
  )

  function scrollToPage(page: number) {
    const scroller = scrollerRef.current
    if (!scroller) return

    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    scroller.scrollTo({
      left: (maxScroll * page) / (PAGE_COUNT - 1),
      behavior: 'smooth',
    })
  }

  return (
    <section className="mt-10 min-w-0 sm:mt-14" aria-label={title}>
      <h2 className="mb-4 border-b border-[#49301f] pb-2 text-xs font-semibold text-[#d99045] sm:mb-5 sm:text-sm">
        {title}
      </h2>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Anúncios recomendados"
        onScroll={(event) => {
          const scroller = event.currentTarget
          const maxScroll = scroller.scrollWidth - scroller.clientWidth
          const progress = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0
          setActivePage(Math.round(progress * (PAGE_COUNT - 1)))
        }}
        className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
      >
        {items.map((nft, index) => (
          <Link
            key={`${nft.id}-${index}`}
            to="/nft/$nftId"
            params={{ nftId: nft.id }}
            className="group w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-[19%]"
          >
            <div className="overflow-hidden rounded-t-md bg-[#211711] p-2">
              <div className="aspect-square overflow-hidden rounded">
                <img
                  src={nft.image}
                  alt={nft.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="px-1 pt-2">
              <p className="truncate text-[10px] text-[#d8c4ac]">{nft.name}</p>
              <p className="mt-1 text-[10px] font-semibold text-[#d99045]">
                {nft.price} ETH
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label="Paginação do carrossel">
        {Array.from({ length: PAGE_COUNT }, (_, page) => (
          <button
            key={page}
            type="button"
            onClick={() => scrollToPage(page)}
            aria-label={`Ir para a posição ${page + 1} de ${PAGE_COUNT}`}
            aria-current={activePage === page ? 'true' : undefined}
            className={`h-2 rounded-full transition-all ${
              activePage === page
                ? 'w-3 bg-[#d99045]'
                : 'w-2 bg-[#65452f] hover:bg-[#a97543]'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
