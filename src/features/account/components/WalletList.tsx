
import { Pencil, Plus, Trash2, Wallet } from 'lucide-react'
import type { CollectorWallet } from '../types/account'

interface WalletListProps {
  wallets: CollectorWallet[]
  onAdd: () => void
  onEdit: (wallet: CollectorWallet) => void
  onRemove: (id: string) => void
  isRemoving: boolean
}

export function WalletList({
  wallets,
  onAdd,
  onEdit,
  onRemove,
  isRemoving,
}: WalletListProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#F5EBDD]">
            Minhas carteiras
          </h2>
          <p className="mt-1 text-sm text-[#A89580]">
            Gerencie suas carteiras digitais
          </p>
        </div>

        {wallets.length < 2 && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-[#E98A36] px-4 py-2.5 text-sm font-semibold text-[#211A15] transition hover:bg-[#F5A653]"
          >
            <Plus size={17} />
            Adicionar carteira
          </button>
        )}
      </div>

      {wallets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#514235] bg-[#211A15] px-5 py-10 text-center">
          <Wallet size={32} className="mx-auto text-[#A89580]" />
          <h3 className="mt-3 font-medium text-[#F5EBDD]">
            Nenhuma carteira cadastrada
          </h3>
          <p className="mt-1 text-sm text-[#A89580]">
            Adicione sua carteira principal para começar.
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-5 rounded-xl bg-[#E98A36] px-5 py-2.5 text-sm font-semibold text-[#211A15] hover:bg-[#F5A653]"
          >
            Cadastrar carteira
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {wallets.map((wallet) => (
            <article
              key={wallet.id}
              className="rounded-2xl border border-[#514235] bg-[#211A15] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#E98A36]/10 p-3">
                    <Wallet size={22} className="text-[#E98A36]" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#F5EBDD]">
                      {wallet.position === 'primary'
                        ? 'Carteira principal'
                        : 'Carteira secundária'}
                    </h3>
                    <p className="text-xs text-[#A89580]">
                      {wallet.type === 'metamask'
                        ? 'MetaMask'
                        : 'Coinbase Wallet'}{' '}
                      · {wallet.network}
                    </p>
                  </div>
                </div>

                {wallet.position === 'primary' && (
                  <span className="rounded-full bg-[#E98A36]/10 px-3 py-1 text-xs text-[#F5B16D]">
                    Principal
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-xs text-[#A89580]">Endereço</p>
                  <p className="mt-1 break-all font-mono text-sm text-[#D8C5AE]">
                    {wallet.address}
                  </p>
                </div>

                {wallet.ensName && (
                  <div>
                    <p className="text-xs text-[#A89580]">Nome ENS</p>
                    <p className="mt-1 text-sm text-[#F5B16D]">
                      {wallet.ensName}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-3 border-t border-[#514235] pt-4">
                <button
                  type="button"
                  onClick={() => onEdit(wallet)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#514235] py-2 text-sm text-[#D8C5AE] transition hover:bg-[#33271E]"
                >
                  <Pencil size={15} />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(wallet.id)}
                  disabled={isRemoving}
                  aria-label="Excluir carteira"
                  className="flex items-center justify-center rounded-lg border border-red-900/50 px-4 py-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
