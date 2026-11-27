
import {
  ShoppingCart,
  UserRound,
  LogOut,
} from 'lucide-react'

import { Link } from '@tanstack/react-router'

import { useAuth } from '../../features/account/hooks/useAuth'
import { SearchBar } from '../../features/catalog/components/SearchBar'

interface HeaderProps {
  searchValue: string
  isSearchOpen: boolean
  onSearchChange: (value: string) => void
  onSearchToggle: () => void
  onLoginClick: () => void
}

export function Header({
  searchValue,
  isSearchOpen,
  onSearchChange,
  onSearchToggle,
  onLoginClick,
}: HeaderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    isLoggingOut,
  } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao sair da conta:', error)
    }
  }

  return (
    <header className="flex min-h-[68px] items-center justify-between gap-3 border-b border-[#302019]">
      {/* LOGO */}
      <Link
        to="/"
        className="shrink-0 text-sm font-bold tracking-[0.2em] text-[#eee3d2]"
      >
        KURIO
      </Link>

      {/* NAVEGAÇÃO */}
      <nav className="hidden h-[68px] items-center gap-8 md:flex">
        <Link
          to="/"
          className="flex h-full items-center border-b-2 border-[#d99045] px-1 text-xs text-[#d99045]"
        >
          Início
        </Link>

        <a
          href="/#mercado"
          className="text-xs text-[#c0ae98] transition hover:text-[#d99045]"
        >
          Mercado
        </a>

        <a
          href="/#criadores"
          className="text-xs text-[#c0ae98] transition hover:text-[#d99045]"
        >
          Criadores
        </a>

        <a
          href="/#aprenda"
          className="text-xs text-[#c0ae98] transition hover:text-[#d99045]"
        >
          Aprenda
        </a>
      </nav>

      {/* AÇÕES */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <SearchBar
          value={searchValue}
          isOpen={isSearchOpen}
          onChange={onSearchChange}
          onToggle={onSearchToggle}
        />

        <Link
          to="/cart"
          aria-label="Carrinho"
          className="group shrink-0 rounded-md p-2 text-[#eee3d2] transition duration-200 hover:scale-105 hover:bg-[#211711] hover:text-[#d99045] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99045]/70"
        >
          <ShoppingCart size={18} className="transition-transform duration-200 group-hover:-rotate-6" />
        </Link>

        {isLoading ? (
          <span className="hidden text-xs text-[#a9957d] sm:inline">
            Carregando...
          </span>
        ) : isAuthenticated && user ? (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/account"
              className="flex items-center gap-2 rounded bg-[#d99045] px-2 py-2 text-[11px] font-semibold text-[#170f0a] transition hover:bg-[#e9a45b] sm:px-3"
            >
              <UserRound size={14} />

              <span className="hidden max-w-24 truncate sm:inline">
                {user.name.split(' ')[0]}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sair da conta"
              title="Sair da conta"
              className="text-[#c0ae98] transition hover:text-[#d99045] disabled:opacity-50"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="flex shrink-0 items-center gap-1 rounded bg-[#d99045] px-2 py-2 text-[11px] font-semibold text-[#170f0a] transition hover:bg-[#e9a45b] sm:px-3"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  )
}
