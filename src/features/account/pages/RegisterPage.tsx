import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
    const navigate = useNavigate()
    const { register, isRegistering } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()
        setError('')

        try {
            await register({ name, email, password })
            await navigate({ to: '/account' })
        } catch (err: any) {
            setError(
                err.response?.data?.message ??
                'Não foi possível criar sua conta.',
            )
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#100d0b] px-4 py-6 text-[#f0e5d5] sm:py-10">
            <section className="w-full max-w-md rounded-lg border border-[#35251b] bg-[#1c140f] p-5 sm:p-8">
                <div className="mb-8 text-center">
                    <p className="mb-6 text-sm font-bold tracking-[0.3em] text-[#d99045]">KURIO</p>
                    <UserPlus
                        size={38}
                        className="mx-auto mb-4 text-[#d99045]"
                    />

                    <h1 className="break-words text-2xl font-bold sm:text-3xl">
                        Criar conta
                    </h1>

                    <p className="mt-2 text-sm text-[#b9a895]">
                        Faça parte da comunidade Kurio.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm"
                        >
                            Nome
                        </label>

                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Seu nome"
                            className="w-full rounded border border-[#493326] bg-[#100d0b] px-4 py-3 text-[#f0e5d5] outline-none focus:border-[#d99045]"
                        />
                    </div>

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
                            minLength={6}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Mínimo de 6 caracteres"
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
                        disabled={isRegistering}
                        className="w-full rounded bg-[#d99045] px-5 py-3 font-bold text-[#170f0a] transition hover:bg-[#e9a45b] disabled:opacity-50"
                    >
                        {isRegistering ? 'Criando conta...' : 'Criar minha conta'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#b9a895]">
                    Já possui uma conta?{' '}
                    <Link
                        to="/login"
                        className="font-bold text-[#e9a45b] hover:underline"
                    >
                        Entrar
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
