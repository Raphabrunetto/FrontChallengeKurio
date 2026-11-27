
import { Link } from '@tanstack/react-router'
import { useNFTs } from '../hooks/useNFTs'

export function HeroSection() {
  const { data, isLoading } = useNFTs({
    limit: 50,
    sort: 'newest',
  })

  const featuredNFT = data?.items
    .filter((nft) => nft.featured)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )[0]

  return (
    <section className="mb-4 grid grid-cols-[minmax(0,1fr)_minmax(100px,38%)] items-center gap-3 overflow-hidden rounded-xl border border-[#49301f] bg-[#2a1b12] px-4 py-4 sm:gap-5 sm:px-5 md:mb-0 md:grid-cols-2 md:gap-12 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-10">
      <div className="order-1 min-w-0 max-w-xl md:order-1">
        <span className="mb-2 block text-[9px] tracking-[0.12em] text-[#c0ae98] sm:mb-4 sm:text-[11px]">
          Bem-vindo à Kurio
        </span>

        <h1 className="break-words font-mono text-[13px] font-bold leading-[1.35] tracking-tight min-[380px]:text-sm sm:text-3xl md:text-4xl">
          SEJA DONO DO FUTURO
          <br />
          DA ARTE DIGITAL
        </h1>

        <p className="mt-4 hidden max-w-md text-[11px] leading-[1.9] text-[#a9957d] sm:block sm:text-xs">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>

        <a
          href="#mercado"
          className="mt-3 inline-flex rounded bg-[#d99045] px-3 py-2 text-[9px] font-bold text-[#170f0a] transition hover:bg-[#e9a45b] sm:mt-6 sm:px-5 sm:py-3 sm:text-[11px]"
        >
          EXPLORAR
        </a>
      </div>

      <div className="order-2 flex min-w-0 justify-center md:order-2 md:justify-end">
        {isLoading || !featuredNFT ? (
          <div className="h-32 w-full max-w-[420px] animate-pulse rounded-xl bg-[#211711] sm:h-60 md:h-[320px]" />
        ) : (
          <Link
            to="/nft/$nftId"
            params={{ nftId: featuredNFT.id }}
            className="group relative block h-32 w-full max-w-[420px] overflow-hidden rounded-lg border border-[#49301f] bg-[#211711] sm:h-60 md:h-[320px] md:rounded-xl"
          >
            <img
              src={featuredNFT.image}
              alt={`${featuredNFT.name}, NFT da coleção ${featuredNFT.collection}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-2 pt-8 sm:p-4 sm:pt-16 md:p-5 md:pt-20">
              <span className="hidden text-[10px] font-semibold tracking-[0.2em] text-[#e9a45b] sm:block">
                DESTAQUE ESPECIAL
              </span>

              <h2 className="truncate text-[10px] font-bold text-white sm:mt-2 sm:text-lg md:text-xl">
                {featuredNFT.name}
              </h2>

              <p className="hidden text-xs text-[#d4c2ad] sm:mt-1 sm:block">
                {featuredNFT.collection} · {featuredNFT.creator}
              </p>

              <div className="mt-1 flex items-center justify-between sm:mt-3">
                <span className="text-[9px] font-bold text-[#e9a45b] sm:text-sm">
                  {featuredNFT.price} ETH
                </span>

                <span className="hidden text-xs text-white transition group-hover:text-[#e9a45b] sm:block">
                  Ver NFT →
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}
