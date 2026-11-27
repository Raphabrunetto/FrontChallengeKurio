
import heroImg from '../../../assets/hero.png'

export function HeroSection() {
  return (
    <section className="grid items-center gap-6 py-7 sm:gap-8 sm:py-8 md:grid-cols-2 md:gap-12 md:py-10">
      {/* TEXTO */}
      <div className="order-2 max-w-xl md:order-1">
        <span className="mb-4 block text-[10px] tracking-[0.15em] text-[#c0ae98] sm:text-[11px]">
          Bem-vindo à Kurio
        </span>

        <h1 className="font-mono text-2xl font-bold leading-[1.35] tracking-tight sm:text-3xl md:text-4xl">
          SEJA DONO DO FUTURO
          <br />
          DA ARTE DIGITAL
        </h1>

        <p className="mt-4 max-w-md text-[11px] leading-[1.9] text-[#a9957d] sm:text-xs">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>

        <a
          href="#mercado"
          className="mt-6 inline-flex rounded bg-[#d99045] px-5 py-3 text-[11px] font-bold text-[#170f0a] transition hover:bg-[#e9a45b]"
        >
          EXPLORAR
        </a>
      </div>

      {/* IMAGEM */}
      <div className="order-1 h-[210px] overflow-hidden rounded-xl bg-[#211711] sm:h-[280px] md:order-2 md:ml-auto md:h-[320px] md:w-full md:max-w-[420px]">
        <img
          src={heroImg}
          alt="Arte digital em destaque"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  )
}
