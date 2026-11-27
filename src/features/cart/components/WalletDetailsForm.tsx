
import { Wallet } from 'lucide-react'
import type { CollectorWallet } from '../../account/types/account'

interface WalletDetailsFormProps {
  wallets: CollectorWallet[]
  selectedWalletId: string
  onSelect: (walletId: string) => void
  isLoading: boolean
  isRequired: boolean
}

export function WalletDetailsForm({
  wallets,
  selectedWalletId,
  onSelect,
  isLoading,
  isRequired,
}: WalletDetailsFormProps) {
  return (
    <section className="rounded-lg border border-[#35251b] bg-[#1c140f] p-6 sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <div className="rounded-lg bg-[#2a1b12] p-3">
          <Wallet className="text-[#d99045]" size={21} />
        </div>

        <div>
          <h2 className="font-bold">Suas carteiras</h2>
          <p className="text-xs text-[#8f7d6c]">
            {isRequired
              ? 'Selecione a carteira que deseja utilizar no pagamento.'
              : 'Suas carteiras cadastradas para pagamentos futuros.'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-[#b9a895]">
          Carregando suas carteiras...
        </p>
      ) : wallets.length === 0 ? (
        <div className="rounded border border-[#493326] bg-[#100d0b] p-5">
          <p className="text-sm text-[#b9a895]">
            Você ainda não cadastrou nenhuma carteira.
          </p>

          <p className="mt-2 text-xs text-[#8f7d6c]">
            Acesse sua conta para cadastrar uma carteira principal ou secundária.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => {
            const isSelected = selectedWalletId === wallet.id

            return (
              <button
                key={wallet.id}
                type="button"
                onClick={() => onSelect(wallet.id)}
                aria-pressed={isSelected}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  isSelected
                    ? 'border-[#d99045] bg-[#2a1b12]'
                    : 'border-[#493326] hover:bg-[#251a13]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[#f0e5d5]">
                    {wallet.position === 'primary'
                      ? 'Carteira principal'
                      : 'Carteira secundária'}
                  </span>

                  {isSelected && (
                    <span className="text-xs font-semibold text-[#e9a45b]">
                      Selecionada
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-[#b9a895]">
                  {wallet.type === 'metamask'
                    ? 'MetaMask'
                    : 'Coinbase Wallet'}{' '}
                  · {wallet.network}
                </p>

                <p className="mt-2 break-all font-mono text-xs text-[#b9a895]">
                  {wallet.address}
                </p>

                {wallet.ensName && (
                  <p className="mt-2 text-xs text-[#e9a45b]">
                    ENS: {wallet.ensName}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}

      {isRequired && wallets.length === 0 && !isLoading && (
        <p className="mt-4 text-xs text-[#e5a18a]">
          Cadastre uma carteira antes de escolher esse método de pagamento.
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-[#8f7d6c]">
        A seleção é utilizada apenas para simular o fluxo de compra.
        Nenhuma conexão real com extensões ou blockchain será realizada.
      </p>
    </section>
  )
}
