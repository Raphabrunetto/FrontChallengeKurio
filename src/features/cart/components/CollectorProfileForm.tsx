import { UserRound } from 'lucide-react'
import type { CollectorDetails } from '../types/checkout'

interface CollectorProfileFormProps {
  value: CollectorDetails
  onChange: (
    field: keyof CollectorDetails,
    value: string,
  ) => void
}

const inputClass =
  'w-full rounded border border-[#493326] bg-[#100d0b] px-4 py-3 text-sm outline-none focus:border-[#d99045]'

export function CollectorProfileForm({ value, onChange }: CollectorProfileFormProps) {
  return (
    <section className="rounded-lg border border-[#35251b] bg-[#1c140f] p-6 sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <div className="rounded-lg bg-[#2a1b12] p-3">
          <UserRound className="text-[#d99045]" size={21} />
        </div>
        <div>
          <h2 className="font-bold">Perfil do colecionador</h2>
          <p className="text-xs text-[#8f7d6c]">Informações para identificar sua compra</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-[#b9a895]">
          Nome de exibição *
          <input
            required
            value={value.displayName}
            onChange={(event) => onChange('displayName', event.target.value)}
            placeholder="Seu nome"
            className={`${inputClass} mt-2`}
          />
        </label>

        <label className="block text-sm text-[#b9a895]">
          Nome de usuário *
          <input
            required
            value={value.username}
            onChange={(event) => onChange('username', event.target.value)}
            placeholder="@seuusuario"
            className={`${inputClass} mt-2`}
          />
        </label>

        <label className="block text-sm text-[#b9a895]">
          E-mail *
          <input
            required
            type="email"
            value={value.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="seu@email.com"
            className={`${inputClass} mt-2`}
          />
        </label>

        <label className="block text-sm text-[#b9a895]">
          Código de indicação
          <input
            value={value.referralCode}
            onChange={(event) => onChange('referralCode', event.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>
    </section>
  )
}
