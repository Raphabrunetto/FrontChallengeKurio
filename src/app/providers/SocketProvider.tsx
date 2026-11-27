
import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { USE_MOCKS } from '../../services/api/axios'

import type { ReactNode } from 'react'
import type { Collector } from '../../features/account/types/account'
import type {
    NFT,
    NFTListResponse,
} from '../../features/catalog/types/nft'

const AUTH_QUERY_KEY = ['auth', 'user']

const REALTIME_URL =
    import.meta.env.VITE_REALTIME_URL || 'http://localhost:3001'

interface NFTUpdatedEvent {
    eventId: string
    resourceId: string
    version: number
    price: string
    availableEditions: number
    occurredAt: string
}

interface ReconcileResponse {
    nfts: NFTSnapshot[]
    orders: unknown[]
}

interface NFTSnapshot {
    id: string
    version: number
    price: string
    availableEditions: number
}

interface SocketProviderProps {
    children: ReactNode
}

export function SocketProvider({
    children,
}: SocketProviderProps) {
    const queryClient = useQueryClient()
    const lastVersions = useRef(new Map<string, number>())

    const authQuery = useQuery<Collector | null>({
        queryKey: AUTH_QUERY_KEY,
        queryFn: async () => null,
        enabled: false,
    })

    const user = authQuery.data

    useEffect(() => {
        if (USE_MOCKS) {
            lastVersions.current.clear()
            return
        }

        const userId = user?.id

        if (!userId) {
            lastVersions.current.clear()
            return
        }

        let cancelled = false
        let socket: ReturnType<typeof io> | null = null

        // Aplica eventos e snapshots respeitando a versão mais recente.
        function applyNFTSnapshot(snapshot: NFTSnapshot) {
            const cachedLists =
                queryClient.getQueriesData<NFTListResponse>({
                    queryKey: ['nfts'],
                })

            const cachedDetails =
                queryClient.getQueriesData<NFT>({
                    queryKey: ['nft'],
                })

            let cachedVersion = 0

            for (const [, data] of cachedLists) {
                const nft = data?.items.find(
                    (item) => item.id === snapshot.id,
                )

                cachedVersion = Math.max(
                    cachedVersion,
                    nft?.version ?? 0,
                )
            }

            for (const [, nft] of cachedDetails) {
                if (nft?.id === snapshot.id) {
                    cachedVersion = Math.max(
                        cachedVersion,
                        nft.version ?? 0,
                    )
                }
            }

            const lastVersion =
                lastVersions.current.get(snapshot.id) ?? 0

            const currentVersion = Math.max(
                cachedVersion,
                lastVersion,
            )

            if (snapshot.version <= currentVersion) {
                console.info(
                    '[Socket.IO] Snapshot antigo ou duplicado ignorado:',
                    snapshot.id,
                    snapshot.version,
                )
                return
            }

            lastVersions.current.set(
                snapshot.id,
                snapshot.version,
            )

            const updateNFT = (nft: NFT): NFT => {
                if (nft.id !== snapshot.id) {
                    return nft
                }

                if (
                    nft.version !== undefined &&
                    nft.version >= snapshot.version
                ) {
                    return nft
                }

                return {
                    ...nft,
                    version: snapshot.version,
                    price: snapshot.price,
                    availableEditions: snapshot.availableEditions,
                }
            }

            // Atualiza todas as listagens em cache.
            queryClient.setQueriesData<NFTListResponse>(
                { queryKey: ['nfts'] },
                (previous) => {
                    if (!previous) {
                        return previous
                    }

                    return {
                        ...previous,
                        items: previous.items.map(updateNFT),
                    }
                },
            )

            // Atualiza os detalhes do NFT em cache.
            queryClient.setQueriesData<NFT>(
                { queryKey: ['nft'] },
                (previous) => {
                    if (!previous || previous.id !== snapshot.id) {
                        return previous
                    }

                    return updateNFT(previous)
                },
            )

            console.info(
                '[Socket.IO] NFT sincronizado:',
                snapshot.id,
                'versão:',
                snapshot.version,
            )
        }

        // Recupera os IDs dos NFTs atualmente presentes no cache.
        function getCachedNFTIds(): string[] {
            const ids = new Set<string>()

            const lists =
                queryClient.getQueriesData<NFTListResponse>({
                    queryKey: ['nfts'],
                })

            const details =
                queryClient.getQueriesData<NFT>({
                    queryKey: ['nft'],
                })

            for (const [, data] of lists) {
                data?.items.forEach((nft) => ids.add(nft.id))
            }

            for (const [, nft] of details) {
                if (nft?.id) {
                    ids.add(nft.id)
                }
            }

            return [...ids]
        }

        // Solicita ao backend o estado atual dos recursos.
        function reconcile() {
            if (!socket?.connected) {
                return
            }

            const nftIds = getCachedNFTIds()

            console.info(
                '[Socket.IO] Iniciando reconciliação:',
                nftIds,
            )

            socket.timeout(5000).emit(
                'reconcile',
                {
                    nftIds,
                    orderIds: [],
                },
                (
                    error: Error | null,
                    response: ReconcileResponse,
                ) => {
                    if (error) {
                        console.error(
                            '[Socket.IO] Falha na reconciliação:',
                            error.message,
                        )
                        return
                    }

                    if (!response || !Array.isArray(response.nfts)) {
                        console.error(
                            '[Socket.IO] Resposta de reconciliação inválida.',
                        )
                        return
                    }

                    response.nfts.forEach((nft) => {
                        applyNFTSnapshot(nft)
                    })

                    console.info(
                        '[Socket.IO] Reconciliação concluída:',
                        response.nfts.length,
                        'NFT(s) sincronizado(s).',
                    )
                },
            )
        }

        async function connect() {
            try {
                const response = await fetch(
                    `${REALTIME_URL}/dev/session`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                        }),
                    },
                )

                if (!response.ok) {
                    throw new Error(
                        `Falha ao criar sessão realtime: ${response.status}`,
                    )
                }

                const data: { token: string } = await response.json()

                if (cancelled) {
                    return
                }

                socket = io(REALTIME_URL, {
                    auth: {
                        token: data.token,
                    },
                    reconnection: true,
                    reconnectionAttempts: Infinity,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                })

                socket.on('connect', () => {
                    console.info(
                        '[Socket.IO] Conectado:',
                        socket?.id,
                    )

                    // Executado tanto na conexão inicial quanto nas reconexões.
                    reconcile()
                })

                socket.on('connect_error', (error) => {
                    console.error(
                        '[Socket.IO] Erro de conexão:',
                        error.message,
                    )
                })

                socket.on('disconnect', (reason) => {
                    console.info(
                        '[Socket.IO] Desconectado:',
                        reason,
                    )
                })

                socket.on(
                    'nft.updated',
                    (event: NFTUpdatedEvent) => {
                        console.info(
                            '[Socket.IO] Evento recebido:',
                            event.eventId,
                        )

                        applyNFTSnapshot({
                            id: event.resourceId,
                            version: event.version,
                            price: event.price,
                            availableEditions: event.availableEditions,
                        })
                    },
                )
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        '[Socket.IO] Falha ao inicializar:',
                        error,
                    )
                }
            }
        }

        lastVersions.current.clear()

        void connect()

        return () => {
            cancelled = true
            socket?.disconnect()
            socket = null
            lastVersions.current.clear()
        }
    }, [user?.id, queryClient])

    return <>{children}</>
}
