
import { Search, ShoppingCart, LogIn } from 'lucide-react'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="navbar">
          <a href="/" className="navbar-logo">
            KURIO
          </a>

          <nav className="navbar-links" aria-label="Navegação principal">
            <a href="/" className="active">Início</a>
            <a href="#mercado">Mercado</a>
            <a href="#criadores">Criadores</a>
            <a href="#aprenda">Aprenda</a>
          </nav>

          <div className="navbar-actions">
            <button className="icon-button" aria-label="Pesquisar">
              <Search size={18} />
            </button>

            <button className="icon-button cart-button" aria-label="Carrinho">
              <ShoppingCart size={18} />
              <span className="cart-count">0</span>
            </button>

            <button className="login-button">
              <LogIn size={15} />
              Entrar
            </button>
          </div>
        </header>

        <main>
          <section className="hero-section">
            <div className="hero-content">
              <span className="eyebrow">Bem-vindo à Kurio</span>

              <h1>
                SEJA DONO DO FUTURO
                <br />
                DA ARTE DIGITAL
              </h1>

              <p>
                Descubra NFTs selecionados de criadores emergentes e consagrados.
                Colecione arte digital rara, apoie artistas e tenha uma parte da
                cultura da internet.
              </p>

              <a href="#mercado" className="primary-button">
                EXPLORAR
              </a>
            </div>

            <div className="hero-image-wrapper">
              <img
                src={heroImg}
                alt="NFT em destaque da coleção Kurio"
                className="hero-image"
              />
            </div>
          </section>

          <section id="mercado" className="catalog-placeholder">
            <span className="eyebrow">Kurio Marketplace</span>
            <h2>Explore o mercado</h2>
            <p>
              Nossa próxima etapa será implementar o catálogo completo,
              com filtros, categorias e coleções.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
