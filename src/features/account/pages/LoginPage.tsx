import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
    const navigate = useNavigate()
    const { login, isLoggingIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()
        setError('')

        try {
            await login({ email, password })
            await navigate({ to: '/account' })
        } catch (err: any) {
            setError(
                err.response?.data?.message ??
                'Não foi possível entrar na sua conta.',
            )
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#100d0b] px-4 py-10 text-[#f0e5d5]">
            <section className="w-full max-w-md rounded-lg border border-[#35251b] bg-[#1c140f] p-8">
                <div className="mb-8 text-center">
                    <LogIn
                        size={38}
                        className="mx-auto mb-4 text-[#d99045]"
                    />

                    <h1 className="text-3xl font-bold">
                        Bem-vindo de volta
                    </h1>

                    <p className="mt-2 text-sm text-[#b9a895]">
                        Entre na sua conta de colecionador.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm"
                        >
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seu@email.com"
                            className="w-full rounded border border-[#493326] bg-[#100d0b] px-4 py-3 text-[#f0e5d5] outline-none focus:border-[#d99045]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm"
                        >
                            Senha
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Sua senha"
                            className="w-full rounded border border-[#493326] bg-[#100d0b] px-4 py-3 text-[#f0e5d5] outline-none focus:border-[#d99045]"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full rounded bg-[#d99045] px-5 py-3 font-bold text-[#170f0a] transition hover:bg-[#e9a45b] disabled:opacity-50"
                    >
                        {isLoggingIn ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#b9a895]">
                    Ainda não tem uma conta?{' '}
                    <Link
                        to="/register"
                        className="font-bold text-[#e9a45b] hover:underline"
                    >
                        Cadastre-se
                    </Link>
                </p>

                <Link
                    to="/"
                    className="mt-5 block text-center text-sm text-[#b9a895] hover:text-[#e9a45b]"
                >
                    Voltar ao marketplace
                </Link>
            </section>
        </main>
    )
}