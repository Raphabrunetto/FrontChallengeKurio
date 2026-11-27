
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { nftService } from '../services/nft.service'
import { useNFTs } from '../hooks/useNFTs'
import { RecommendationCarousel } from '../components/RecommendationCarousel'
import { useCart } from '../../cart/hooks/useCart'

export function NFTDetailsPage() {
    const { nftId } = useParams({ from: '/nft/$nftId' })

    const { addItem, isAdding } = useCart()
    const [cartMessage, setCartMessage] = useState('')
    const { data: catalog } = useNFTs({ limit: 50, sort: 'newest' })

    const {
        data: nft,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['nft', nftId],
        queryFn: () => nftService.getById(nftId),
    })

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-5 text-center text-[#d99045]">
                Carregando NFT...
            </div>
        )
    }

    if (isError || !nft) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
                <p className="text-[#eee3d2]">NFT não encontrado.</p>

                <Link
                    to="/"
                    className="text-sm text-[#d99045] hover:underline"
                >
                    Voltar ao marketplace
                </Link>
            </div>
        )
    }

    const otherNFTs = (catalog?.items ?? []).filter(
        (item) => item.id !== nft.id,
    )
    const relatedNFTs = [
        ...otherNFTs.filter((item) => item.collection === nft.collection),
        ...otherNFTs.filter((item) => item.collection !== nft.collection),
    ]

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
            <div className="w-full lg:my-auto">
                {/* VOLTAR */}
                <Link
                    to="/"
                    className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm text-[#b9a184] transition hover:text-[#d99045] sm:mb-8"
                >
                    <ArrowLeft size={17} />
                    Voltar ao marketplace
                </Link>

                {/* CONTEÚDO */}
                <div className="grid min-w-0 items-start gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
                    {/* IMAGEM */}
                    <div className="min-w-0 overflow-hidden rounded-xl bg-[#211711] p-2 sm:p-3">
                        <img
                            src={nft.image}
                            alt={nft.name}
                            decoding="async"
                            className="aspect-square w-full rounded-lg object-cover"
                        />
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="relative z-10 -mt-8 min-w-0 rounded-xl border border-[#35251b] bg-[#1c140f] p-4 sm:p-6 md:mt-0 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:py-2">
                        <p className="mb-3 text-xs uppercase tracking-widest text-[#d99045]">
                            {nft.collection}
                        </p>

                        <h1 className="break-words text-2xl font-bold text-[#eee3d2] sm:text-3xl md:text-4xl">
                            {nft.name}
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-[#b9a184] sm:mt-5">
                            {nft.description}
                        </p>

                        {/* DETALHES */}
                        <div className="mt-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:mt-8 sm:gap-4">
                            <div className="min-w-0 rounded-lg bg-[#211711] p-3 sm:p-4">
                                <p className="text-xs text-[#a9957d]">
                                    Criador
                                </p>

                                <p className="mt-2 break-words text-sm font-semibold text-[#eee3d2]">
                                    {nft.creator}
                                </p>
                            </div>

                            <div className="min-w-0 rounded-lg bg-[#211711] p-3 sm:p-4">
                                <p className="text-xs text-[#a9957d]">
                                    Categoria
                                </p>

                                <p className="mt-2 break-words text-sm font-semibold text-[#eee3d2]">
                                    {nft.category}
                                </p>
                            </div>

                            <div className="min-w-0 rounded-lg bg-[#211711] p-3 sm:p-4">
                                <p className="text-xs text-[#a9957d]">
                                    Edições disponíveis
                                </p>

                                <p className="mt-2 text-sm font-semibold text-[#eee3d2]">
                                    {nft.availableEditions} / {nft.totalEditions}
                                </p>
                            </div>

                            <div className="min-w-0 rounded-lg bg-[#211711] p-3 sm:p-4">
                                <p className="text-xs text-[#a9957d]">
                                    Publicado em
                                </p>

                                <p className="mt-2 text-sm font-semibold text-[#eee3d2]">
                                    {new Date(nft.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        {/* COMPRA */}
                        <div className="mt-6 border-t border-[#38271d] pt-5 sm:mt-8 sm:pt-6">
                            <p className="text-xs text-[#a9957d]">
                                Preço atual
                            </p>

                            <p className="mt-2 text-2xl font-bold text-[#d99045] sm:text-3xl">
                                {nft.price} {nft.currency}
                            </p>

                            <button
                                type="button"
                                disabled={nft.availableEditions <= 0 || isAdding}
                                onClick={async () => {
                                    try {
                                        setCartMessage('')

                                        await addItem({
                                            nftId: nft.id,
                                            quantity: 1,
                                        })

                                        setCartMessage('NFT adicionado ao carrinho!')
                                    } catch {
                                        setCartMessage(
                                            'Não foi possível adicionar o NFT ao carrinho.',
                                        )
                                    }
                                }}
                                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#d99045] px-5 py-3 text-sm font-bold text-[#170f0a] transition hover:bg-[#e9a45b] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6 sm:py-4"
                            >
                                <ShoppingCart size={18} />

                                {isAdding
                                    ? 'Adicionando...'
                                    : nft.availableEditions > 0
                                        ? 'Adicionar ao carrinho'
                                        : 'Esgotado'}
                            </button>

                            {cartMessage && (
                                <p
                                    role="status"
                                    aria-live="polite"
                                    className="mt-3 break-words text-center text-sm text-[#d99045]"
                                >
                                    {cartMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <RecommendationCarousel
                title="Mais desta coleção"
                nfts={relatedNFTs}
            />
            </div>
        )
}
