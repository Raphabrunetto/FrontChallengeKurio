
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  isOpen: boolean
  onChange: (value: string) => void
  onToggle: () => void
}

export function SearchBar({
  value,
  isOpen,
  onChange,
  onToggle,
}: SearchBarProps) {
  return (
    <div className="relative flex min-w-0 items-center gap-2">
      {isOpen && (
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onToggle()
            }
          }}
          placeholder="Buscar NFTs..."
          aria-label="Buscar NFTs"
          autoFocus
          className="w-32 max-w-[40vw] rounded border border-[#704b30] bg-[#100d0b] px-2 py-2 text-xs text-[#eee3d2] outline-none placeholder:text-[#806d59] focus:border-[#d99045] sm:w-52 sm:max-w-none sm:px-3"
        />
      )}

      <button
        type="button"
        aria-label={isOpen ? 'Fechar pesquisa' : 'Abrir pesquisa'}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="shrink-0 text-[#eee3d2] transition hover:text-[#d99045]"
      >
        <Search size={18} />
      </button>
    </div>
  )
}
