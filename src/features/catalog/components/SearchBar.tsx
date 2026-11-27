
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
          className="motion-search-enter w-32 max-w-[40vw] rounded-md border border-[#704b30] bg-[#1d1511] px-2 py-2 text-xs text-[#eee3d2] shadow-lg shadow-black/20 outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#806d59] focus:border-[#d99045] focus:bg-[#211711] focus:shadow-[0_0_0_3px_rgb(217_144_69_/_15%)] sm:w-52 sm:max-w-none sm:px-3"
        />
      )}

      <button
        type="button"
        aria-label={isOpen ? 'Fechar pesquisa' : 'Abrir pesquisa'}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="group shrink-0 rounded-md border border-transparent p-2 text-[#eee3d2] transition duration-200 hover:scale-105 hover:border-[#704b30] hover:bg-[#211711] hover:text-[#d99045] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99045]/70"
      >
        <Search size={18} className="transition-transform duration-200 group-hover:rotate-[-8deg]" />
      </button>
    </div>
  )
}
