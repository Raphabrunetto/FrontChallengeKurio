
import {
  Globe,
  Camera,
  MessageCircle,
  PlayCircle,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

const benefits = [
  {
    letter: 'W',
    title: 'Segurança da carteira',
    description:
      'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    letter: 'C',
    title: 'Criadores em destaque',
    description:
      'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    letter: 'D',
    title: 'Alertas de lançamentos',
    description:
      'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
]

const footerSections = [
  {
    title: 'Meu perfil',
    links: [
      { label: 'Meu perfil', to: '/account' },
      { label: 'Minha coleção', to: '/account' },
      { label: 'Atividade', to: '/account' },
      { label: 'Estúdio do criador', to: '/' },
      { label: 'Lista de interesse', to: '/' },
    ],
  },
  {
    title: 'Central de ajuda',
    links: [
      { label: 'Central de ajuda', to: '/' },
      { label: 'Como comprar NFTs', to: '/' },
      { label: 'Carteira e segurança', to: '/' },
      { label: 'Política do mercado', to: '/' },
      { label: 'Denunciar item', to: '/' },
    ],
  },
  {
    title: 'Coleções',
    links: [
      { label: 'Arte digital', to: '/' },
      { label: 'Fotografia', to: '/' },
      { label: 'Música', to: '/' },
      { label: 'Arte 3D', to: '/' },
      { label: 'Utilidade', to: '/' },
    ],
  },
]

const socialIcons = [Globe, Camera, MessageCircle, PlayCircle]

export function Footer() {
  return (
    <footer className="border-t border-[#493020] bg-[#211610] text-[#eee3d2]">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">

        {/* Benefícios e newsletter */}
        <div className="grid gap-8 border-b border-[#493020] py-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d99045] text-lg font-bold text-[#100d0b]">
                {benefit.letter}
              </div>

              <div>
                <h3 className="mb-2 font-semibold">
                  {benefit.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#b9a184]">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}

          <div>
            <h3 className="mb-3 font-semibold">
              Antecipe-se ao próximo lançamento
            </h3>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="flex"
            >
              <input
                type="email"
                placeholder="digite seu e-mail..."
                required
                className="min-w-0 flex-1 rounded-l-md border border-[#493020] bg-[#382211] px-3 py-2 text-sm text-[#eee3d2] outline-none placeholder:text-[#a98b68] focus:border-[#d99045]"
              />

              <button
                type="submit"
                className="rounded-r-md bg-[#d99045] px-4 text-sm font-semibold text-[#100d0b] transition hover:bg-[#e9a45b]"
              >
                Enviar
              </button>
            </form>

            <p className="mt-3 text-xs leading-relaxed text-[#b9a184]">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>
        </div>

        {/* Informações institucionais */}
        <div className="grid gap-5 bg-[#382211] px-5 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          <strong className="tracking-widest">KURIO</strong>

          <p>
            Feito para colecionadores, criadores e cultura digital.
          </p>

          <a
            href="mailto:contato@kurio.com"
            className="transition-colors hover:text-[#d99045]"
          >
            contato@kurio.com
          </a>

          <span>+55 11 4002 8922</span>
        </div>

        {/* Links e redes sociais */}
        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-base font-bold">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#d2c2ae] transition-colors hover:text-[#d99045]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-base font-bold">
              Redes sociais
            </h3>

            <div className="flex gap-2">
              {socialIcons.map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#a66b35] text-[#d99045]"
                >
                  <Icon size={17} />
                </span>
              ))}
            </div>

            <h3 className="mb-3 mt-7 font-bold">
              Carteiras compatíveis
            </h3>

            <div className="inline-flex flex-wrap gap-2 rounded-md border border-[#493020] bg-[#382211] px-3 py-2 text-[10px] font-semibold text-[#d99045]">
              <span>METAMASK</span>
              <span>•</span>
              <span>WALLETCONNECT</span>
              <span>•</span>
              <span>COINBASE</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#493020] py-4 text-center text-xs text-[#b9a184]">
          © 2026 Kurio. Propriedade digital para todos.
        </div>
      </div>
    </footer>
  )
}
