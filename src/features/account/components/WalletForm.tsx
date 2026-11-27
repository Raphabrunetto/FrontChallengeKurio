
import { useEffect, useState } from 'react'
import { LoaderCircle, Wallet } from 'lucide-react'
import type {
  CollectorWallet,
  SaveWalletPayload,
  WalletPosition,
  WalletType,
} from '../types/account'

interface WalletFormProps {
  wallet?: CollectorWallet
  onSave: (payload: SaveWalletPayload) => Promise<unknown>
  onCancel?: () => void
  isSaving: boolean
}

export function WalletForm({
  wallet,
  onSave,
  onCancel,
  isSaving,
}: WalletFormProps) {
  const [position, setPosition] = useState<WalletPosition>(
    wallet?.position ?? 'primary',
  )
  const [address, setAddress] = useState(wallet?.address ?? '')
  const [type, setType] = useState<WalletType>(
    wallet?.type ?? 'metamask',
  )
  const [ensName, setEnsName] = useState(wallet?.ensName ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    setPosition(wallet?.position ?? 'primary')
    setAddress(wallet?.address ?? '')
    setType(wallet?.type ?? 'metamask')
    setEnsName(wallet?.ensName ?? '')
    setError('')
  }, [wallet])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const normalizedAddress = address.trim()

    if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      setError('Informe um endereço Ethereum válido.')
      return
    }

    try {
      await onSave({
        position,
        network: 'Ethereum',
        address: normalizedAddress,
        type,
        ensName: ensName.trim(),
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar a carteira.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-[#D8C5AE]">
          Tipo de carteira
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPosition('primary')}
            className={`rounded-xl border p-3 text-sm transition ${
              position === 'primary'
                ? 'border-[#E98A36] bg-[#E98A36]/10 text-[#F5B16D]'
                : 'border-[#514235] text-[#C7B7A5]'
            }`}
          >
            Principal
          </button>

          <button
            type="button"
            onClick={() => setPosition('secondary')}
            className={`rounded-xl border p-3 text-sm transition ${
              position === 'secondary'
                ? 'border-[#E98A36] bg-[#E98A36]/10 text-[#F5B16D]'
                : 'border-[#514235] text-[#C7B7A5]'
            }`}
          >
            Secundária
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-[#D8C5AE]">
          Rede
        </label>
        <select
          value="Ethereum"
          disabled
          className="w-full rounded-xl border border-[#514235] bg-[#211A15] p-3 text-[#D8C5AE]"
        >
          <option value="Ethereum">Ethereum</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="wallet-type"
          className="mb-2 block text-sm text-[#D8C5AE]"
        >
          Provedor da carteira
        </label>
        <select
          id="wallet-type"
          value={type}
          onChange={(event) => setType(event.target.value as WalletType)}
          className="w-full rounded-xl border border-[#514235] bg-[#211A15] p-3 text-[#F5EBDD] outline-none focus:border-[#E98A36]"
        >
          <option value="metamask">MetaMask</option>
          <option value="coinbase">Coinbase Wallet</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="wallet-address"
          className="mb-2 block text-sm text-[#D8C5AE]"
        >
          Endereço da carteira
        </label>
        <input
          id="wallet-address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="0x..."
          required
          className="w-full rounded-xl border border-[#514235] bg-[#211A15] p-3 text-[#F5EBDD] outline-none placeholder:text-[#806F5E] focus:border-[#E98A36]"
        />
      </div>

      <div>
        <label
          htmlFor="wallet-ens"
          className="mb-2 block text-sm text-[#D8C5AE]"
        >
          Nome ENS (opcional)
        </label>
        <input
          id="wallet-ens"
          type="text"
          value={ensName}
          onChange={(event) => setEnsName(event.target.value)}
          placeholder="exemplo.eth"
          className="w-full rounded-xl border border-[#514235] bg-[#211A15] p-3 text-[#F5EBDD] outline-none placeholder:text-[#806F5E] focus:border-[#E98A36]"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-xl border border-[#514235] px-5 py-3 text-sm text-[#D8C5AE] transition hover:bg-[#33271E] disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#E98A36] px-5 py-3 text-sm font-semibold text-[#211A15] transition hover:bg-[#F5A653] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Wallet size={16} />
              {wallet ? 'Salvar alterações' : 'Adicionar carteira'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
