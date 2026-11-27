
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
    <section className="grid items-center gap-8 py-7 sm:py-10 md:grid-cols-2 md:gap-12">
      <div className="order-2 max-w-xl md:order-1">
        <span className="mb-4 block text-[10px] tracking-[0.15em] text-[#c0ae98] sm:text-[11px]">
          Bem-vindo à Kurio
        </span>

        <h1 className="font-mono text-2xl font-bold leading-[1.35] tracking-tight sm:text-3xl md:text-4xl">
          SEJA DONO DO FUTURO
          <br />
          DA ARTE DIGITAL
        </h1>

        <p className="mt-4 max-w-md text-[11px] leading-[1.9] text-[#a9957d] sm:text-xs">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>

        <a
          href="#mercado"
          className="mt-6 inline-flex rounded bg-[#d99045] px-5 py-3 text-[11px] font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
        >
          EXPLORAR
        </a>
      </div>

      <div className="order-1 flex justify-center md:order-2 md:justify-end">
        {isLoading || !featuredNFT ? (
          <div className="h-[320px] w-full max-w-[420px] animate-pulse rounded-xl bg-[#211711]" />
        ) : (
          <Link
            to="/nft/$nftId"
            params={{ nftId: featuredNFT.id }}
            className="group relative block h-[320px] w-full max-w-[420px] overflow-hidden rounded-xl border border-[#49301f] bg-[#211711]"
          >
            <img
              src={featuredNFT.image}
              alt={`${featuredNFT.name}, NFT da coleção ${featuredNFT.collection}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-5 pt-20">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#e9a45b]">
                DESTAQUE ESPECIAL
              </span>

              <h2 className="mt-2 text-xl font-bold text-white">
                {featuredNFT.name}
              </h2>

              <p className="mt-1 text-xs text-[#d4c2ad]">
                {featuredNFT.collection} · {featuredNFT.creator}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#e9a45b]">
                  {featuredNFT.price} ETH
                </span>

                <span className="text-xs text-white transition group-hover:text-[#e9a45b]">
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
