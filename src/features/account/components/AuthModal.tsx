
import { useState } from 'react'
import { X, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { login, register, isLoggingIn, isRegistering } = useAuth()

  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const isLoading = isLoggingIn || isRegistering

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ name, email, password })
      }

      onClose()
    } catch (err) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string
          }
        }
      }

      setError(
        apiError.response?.data?.message ??
          'Não foi possível concluir a operação.',
      )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#493326] bg-[#1c140f] p-6 text-[#f0e5d5] shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-[#b9a895] transition hover:text-[#e9a45b]"
        >
          <X size={21} />
        </button>

        <div className="mb-7 text-center">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-[#d99045]">
            KURIO
          </p>

          {mode === 'login' ? (
            <LogIn size={30} className="mx-auto mb-3 text-[#d99045]" />
          ) : (
            <UserPlus size={30} className="mx-auto mb-3 text-[#d99045]" />
          )}

          <h2 id="auth-title" className="text-2xl font-bold">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h2>

          <p className="mt-2 text-sm text-[#b9a895]">
            {mode === 'login'
              ? 'Entre para continuar sua experiência.'
              : 'Faça parte da comunidade Kurio.'}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg border border-[#493326] bg-[#100d0b] p-1">
          <button
            type="button"
            onClick={() => changeMode('login')}
            className={`rounded-md py-2 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-[#d99045] text-[#170f0a]'
                : 'text-[#b9a895] hover:text-[#f0e5d5]'
            }`}
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => changeMode('register')}
            className={`rounded-md py-2 text-sm font-semibold transition ${
              mode === 'register'
                ? 'bg-[#d99045] text-[#170f0a]'
                : 'text-[#b9a895] hover:text-[#f0e5d5]'
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="mb-2 block text-sm">
                Nome completo
              </label>

              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                className="w-full rounded-md border border-[#493326] bg-[#100d0b] px-4 py-3 text-sm outline-none transition placeholder:text-[#806d59] focus:border-[#d99045]"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-2 block text-sm">
              E-mail
            </label>

            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className="w-full rounded-md border border-[#493326] bg-[#100d0b] px-4 py-3 text-sm outline-none transition placeholder:text-[#806d59] focus:border-[#d99045]"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-2 block text-sm">
              Senha
            </label>

            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              className="w-full rounded-md border border-[#493326] bg-[#100d0b] px-4 py-3 text-sm outline-none transition placeholder:text-[#806d59] focus:border-[#d99045]"
            />
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() =>
                  setMessage('A recuperação de senha será implementada em uma próxima etapa.')
                }
                className="text-xs text-[#d99045] transition hover:text-[#e9a45b]"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-md bg-red-950/40 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="rounded-md bg-[#493326]/40 p-3 text-sm text-[#e9a45b]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#d99045] px-5 py-3 font-bold text-[#170f0a] transition hover:bg-[#e9a45b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar na minha conta'
                : 'Criar minha conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8f7d6c]">
          Ao continuar, você concorda com os termos de uso da Kurio.
        </p>
      </section>
    </div>
  )
}
