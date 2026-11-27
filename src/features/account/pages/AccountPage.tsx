
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
    LogOut,
    UserRound,
    Package,
    ShoppingBag,
    CalendarDays,
    Wallet,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { useWallets } from '../hooks/useWallets'
import { WalletForm } from '../components/WalletForm'
import { WalletList } from '../components/WalletList'

import type {
    CollectorWallet,
    SaveWalletPayload,
} from '../types/account'

import { orderService } from '../../cart/services/order.service'

export function AccountPage() {
    const navigate = useNavigate()

    const { user, isLoading: isAuthLoading, logout } = useAuth()

    // Gerenciamento de carteiras
    const {
        wallets,
        isLoading: isWalletsLoading,
        createWallet,
        updateWallet,
        removeWallet,
        isSaving,
        isRemoving,
    } = useWallets(!!user, user?.id)

    const [isWalletFormOpen, setIsWalletFormOpen] = useState(false)

    const [selectedWallet, setSelectedWallet] =
        useState<CollectorWallet | undefined>()

    // Histórico de compras
    const {
        data: orders = [],
        isLoading: isOrdersLoading,
        isError,
    } = useQuery({
        queryKey: ['orders', user?.id ?? 'anonymous'],
        queryFn: orderService.getAll,
        enabled: !!user,
        staleTime: 0,
        refetchOnMount: 'always',
    })

    async function handleLogout() {
        await logout()
        await navigate({ to: '/login' })
    }

    // Abrir formulário para adicionar carteira
    function handleAddWallet() {
        setSelectedWallet(undefined)
        setIsWalletFormOpen(true)
    }

    // Abrir formulário para editar carteira
    function handleEditWallet(wallet: CollectorWallet) {
        setSelectedWallet(wallet)
        setIsWalletFormOpen(true)
    }

    // Salvar ou atualizar carteira
    async function handleSaveWallet(payload: SaveWalletPayload) {
        if (selectedWallet) {
            await updateWallet({
                id: selectedWallet.id,
                payload,
            })
        } else {
            await createWallet(payload)
        }

        setIsWalletFormOpen(false)
        setSelectedWallet(undefined)
    }

    // Excluir carteira
    async function handleRemoveWallet(id: string) {
        const confirmed = window.confirm(
            'Tem certeza que deseja excluir esta carteira?',
        )

        if (!confirmed) return

        await removeWallet(id)
    }

    if (isAuthLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#100d0b] text-[#f0e5d5]">
                Carregando conta...
            </main>
        )
    }

    if (!user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#100d0b] px-4 text-[#f0e5d5]">
                <p>Você precisa entrar na sua conta.</p>

                <Link
                    to="/login"
                    className="rounded bg-[#d99045] px-6 py-3 font-bold text-[#170f0a]"
                >
                    Fazer login
                </Link>
            </main>
        )
    }

    // Agrupa os NFTs adquiridos em diferentes pedidos.
    const collection = Object.values(
        orders.reduce<
            Record<
                string,
                {
                    nft: (typeof orders)[number]['items'][number]['nft']
                    quantity: number
                }
            >
        >((acc, order) => {
            order.items.forEach((item) => {
                const nftId = item.nft.id

                if (acc[nftId]) {
                    acc[nftId].quantity += item.quantity
                } else {
                    acc[nftId] = {
                        nft: item.nft,
                        quantity: item.quantity,
                    }
                }
            })

            return acc
        }, {}),
    )

    const totalSpent = orders.reduce(
        (total, order) => total + Number(order.total),
        0,
    )

    return (
        <main className="min-h-screen bg-[#100d0b] px-4 py-10 text-[#f0e5d5] sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="mb-8 inline-block text-sm text-[#d99045] transition hover:text-[#e9a45b]"
                >
                    ← Voltar ao marketplace
                </Link>

                {/* Perfil */}
                <section className="min-w-0 rounded-lg border border-[#35251b] bg-[#1c140f] p-4 sm:p-8">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="shrink-0 rounded-lg bg-[#2a1b12] p-3 sm:p-4">
                            <UserRound size={32} className="text-[#d99045]" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="break-words text-xl font-bold sm:text-3xl">
                                Olá, {user.name}!
                            </h1>

                            <p className="mt-1 break-words text-xs text-[#b9a895] sm:text-sm">
                                Bem-vindo à sua conta de colecionador.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-5 border-t border-[#493326] pt-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-[#9b8876]">Nome</p>
                            <p className="mt-1 font-bold">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-[#9b8876]">E-mail</p>
                            <p className="mt-1 break-all font-bold">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-[#9b8876]">Membro desde</p>
                            <p className="mt-1 font-bold">
                                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-8 flex items-center gap-2 rounded border border-[#70402c] px-5 py-3 text-sm text-[#e5a18a] transition hover:bg-[#3a2018]"
                    >
                        <LogOut size={17} />
                        Sair da conta
                    </button>
                </section>

                {/* Indicadores */}
                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-[#35251b] bg-[#1c140f] p-5">
                        <Package className="mb-3 text-[#d99045]" size={23} />

                        <p className="text-sm text-[#9b8876]">
                            NFTs adquiridos
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            {isOrdersLoading
                                ? '...'
                                : collection.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0,
                                )}
                        </p>
                    </div>

                    <div className="rounded-lg border border-[#35251b] bg-[#1c140f] p-5">
                        <ShoppingBag className="mb-3 text-[#d99045]" size={23} />

                        <p className="text-sm text-[#9b8876]">
                            Compras realizadas
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            {isOrdersLoading ? '...' : orders.length}
                        </p>
                    </div>

                    <div className="rounded-lg border border-[#35251b] bg-[#1c140f] p-5">
                        <Wallet className="mb-3 text-[#d99045]" size={23} />

                        <p className="text-sm text-[#9b8876]">
                            Total investido
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#e9a45b]">
                            {isOrdersLoading ? '...' : `${totalSpent.toFixed(3)} ETH`}
                        </p>
                    </div>
                </section>

                {/* Minhas carteiras */}
                <section className="mt-10 rounded-lg border border-[#35251b] bg-[#1c140f] p-6 sm:p-8">
                    {isWalletsLoading ? (
                        <p className="text-sm text-[#9b8876]">
                            Carregando suas carteiras...
                        </p>
                    ) : (
                        <>
                            <WalletList
                                wallets={wallets}
                                onAdd={handleAddWallet}
                                onEdit={handleEditWallet}
                                onRemove={handleRemoveWallet}
                                isRemoving={isRemoving}
                            />

                            {isWalletFormOpen && (
                                <div className="mt-6 border-t border-[#493326] pt-6">
                                    <h3 className="mb-5 text-lg font-bold">
                                        {selectedWallet
                                            ? 'Editar carteira'
                                            : 'Adicionar carteira'}
                                    </h3>

                                    <WalletForm
                                        wallet={selectedWallet}
                                        onSave={handleSaveWallet}
                                        onCancel={() => {
                                            setIsWalletFormOpen(false)
                                            setSelectedWallet(undefined)
                                        }}
                                        isSaving={isSaving}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* Minha coleção */}
                <section className="mt-10">
                    <div className="mb-5 flex items-center gap-3">
                        <Package className="text-[#d99045]" size={23} />
                        <h2 className="text-xl font-bold">Minha coleção</h2>
                    </div>

                    {isOrdersLoading ? (
                        <p className="text-sm text-[#9b8876]">
                            Carregando sua coleção...
                        </p>
                    ) : isError ? (
                        <p className="rounded-lg border border-[#70402c] bg-[#1c140f] p-5 text-sm text-[#e5a18a]">
                            Não foi possível carregar sua coleção.
                        </p>
                    ) : collection.length === 0 ? (
                        <div className="rounded-lg border border-[#35251b] bg-[#1c140f] p-8 text-center">
                            <Package
                                size={36}
                                className="mx-auto mb-3 text-[#806d5c]"
                            />

                            <p className="font-bold">Sua coleção está vazia.</p>

                            <p className="mt-2 text-sm text-[#9b8876]">
                                Quando você adquirir um NFT, ele aparecerá aqui.
                            </p>

                            <Link
                                to="/"
                                className="mt-5 inline-block rounded bg-[#d99045] px-5 py-3 text-sm font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
                            >
                                Explorar marketplace
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {collection.map(({ nft, quantity }) => (
                                <article
                                    key={nft.id}
                                    className="overflow-hidden rounded-lg border border-[#35251b] bg-[#1c140f]"
                                >
                                    <img
                                        src={nft.image}
                                        alt={nft.name}
                                        className="h-52 w-full object-cover"
                                        loading="lazy"
                                    />

                                    <div className="p-4">
                                        <h3 className="font-bold">{nft.name}</h3>

                                        <p className="mt-1 text-sm text-[#9b8876]">
                                            {nft.collection}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between border-t border-[#493326] pt-3">
                                            <span className="text-xs text-[#b9a895]">
                                                Quantidade
                                            </span>

                                            <span className="font-bold text-[#e9a45b]">
                                                {quantity} unidade(s)
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Histórico de compras */}
                <section className="mt-12">
                    <div className="mb-5 flex items-center gap-3">
                        <CalendarDays className="text-[#d99045]" size={23} />
                        <h2 className="text-xl font-bold">
                            Histórico de compras
                        </h2>
                    </div>

                    {isOrdersLoading ? (
                        <p className="text-sm text-[#9b8876]">
                            Carregando histórico...
                        </p>
                    ) : isError ? (
                        <p className="text-sm text-[#e5a18a]">
                            Não foi possível carregar o histórico.
                        </p>
                    ) : orders.length === 0 ? (
                        <div className="rounded-lg border border-[#35251b] bg-[#1c140f] p-6 text-center text-sm text-[#9b8876]">
                            Você ainda não realizou nenhuma compra.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <article
                                    key={order.id}
                                    className="rounded-lg border border-[#35251b] bg-[#1c140f] p-5"
                                >
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="font-bold">{order.id}</p>

                                            <p className="mt-1 text-xs text-[#9b8876]">
                                                {new Date(order.createdAt).toLocaleString('pt-BR')}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="font-bold text-[#e9a45b]">
                                                {Number(order.total).toFixed(3)} ETH
                                            </p>


                                            {order.paymentMethod === 'pix' ? (
                                                <p className="mt-1 text-xs text-[#9b8876]">
                                                    PIX (simulado)
                                                </p>
                                            ) : (
                                                <div className="mt-2 space-y-1 text-xs text-[#b9a895] sm:text-right">
                                                    <p className="font-semibold text-[#e9a45b]">
                                                        {order.wallet
                                                            ? order.wallet.type === 'metamask'
                                                                ? 'MetaMask'
                                                                : 'Coinbase Wallet'
                                                            : 'Carteira digital (fictícia)'}
                                                    </p>

                                                    {order.wallet ? (
                                                        <>
                                                            <p>
                                                                {order.wallet.position === 'primary'
                                                                    ? 'Carteira principal'
                                                                    : 'Carteira secundária'}
                                                            </p>

                                                            <p>
                                                                Rede: {order.wallet.network}
                                                            </p>

                                                            <p className="max-w-xs break-all sm:ml-auto">
                                                                Endereço: {order.wallet.address}
                                                            </p>

                                                            {order.wallet.ensName && (
                                                                <p className="text-[#d99045]">
                                                                    ENS: {order.wallet.ensName}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-[#806d5c]">
                                                            Dados da carteira não registrados neste pedido antigo.
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[#493326] pt-4">
                                        {order.items.map((item) => (
                                            <span
                                                key={item.nft.id}
                                                className="rounded bg-[#100d0b] px-3 py-2 text-xs text-[#b9a895]"
                                            >
                                                {item.nft.name} × {item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
