# Kurio — NFT Marketplace

Marketplace de NFTs desenvolvido como desafio técnico de Front-end, com foco nos fluxos de descoberta, compra e gerenciamento da conta do colecionador.

**Aplicação publicada:** https://kurio-nft-marketplace-sand.vercel.app  
**Repositório:** https://github.com/Raphabrunetto/FrontChallengeKurio

---

## 1. Sobre o projeto

O Kurio é uma aplicação de marketplace de NFTs com dados e serviços simulados. O projeto permite explorar coleções, consultar detalhes dos NFTs, gerenciar um carrinho, realizar compras simuladas e acompanhar o histórico de pedidos.

A aplicação foi desenvolvida para funcionar sem dependência de backend privado, blockchain real ou gateway externo de pagamento.

### Funcionalidades

- **Descoberta de NFTs**
  - Catálogo com listagem de NFTs.
  - Pesquisa por nome, coleção ou criador.
  - Filtro por categoria e faixa de preço.
  - Ordenação por preço e data.
  - Abas de novos lançamentos e itens em alta.
  - Página de detalhes do NFT e disponibilidade de edições.

- **Carrinho e compra**
  - Adicionar, remover e alterar quantidades.
  - Validação de estoque disponível.
  - Resumo de valores e taxa de rede simulada.
  - Cupons `KURIO10` e `KURIO20`.
  - Checkout com PIX simulado ou carteira digital.
  - Confirmação de compra e atualização do estoque.

- **Conta do colecionador**
  - Cadastro, login e logout simulados.
  - Perfil do colecionador.
  - Cadastro, edição e remoção de carteiras.
  - Coleção de NFTs adquiridos.
  - Histórico de compras.

---

## 2. Tecnologias

| Tecnologia | Utilização |
|---|---|
| React | Interface |
| TypeScript | Tipagem estática |
| Vite | Desenvolvimento e build |
| Tailwind CSS v4 | Estilização |
| TanStack Router | Roteamento |
| TanStack Query | Cache e gerenciamento de requisições |
| Axios | Comunicação HTTP |
| MSW | Simulação dos endpoints REST |
| Decimal.js | Cálculos financeiros |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de dados |
| Lucide React | Ícones |
| Playwright | Testes End-to-End |
| Oxlint | Análise estática de código |

---

## 3. Requisitos

- Node.js compatível com Vite 8.
- npm.
- Git.

Não é necessário configurar backend, banco de dados, carteira blockchain ou gateway de pagamento.

---

## 4. Instalação

Clone o repositório:

```bash
git clone https://github.com/Raphabrunetto/FrontChallengeKurio.git
```

Entre na pasta:

```bash
cd FrontChallengeKurio
```

Instale as dependências:

```bash
npm ci
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

### Variáveis de ambiente

Não são necessárias variáveis de ambiente para executar o projeto.

O Mock Service Worker (MSW) é inicializado pela aplicação e intercepta as requisições simuladas, inclusive na versão publicada.

---

## 5. Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Verifica os tipos e gera o build de produção |
| `npm run preview` | Executa uma prévia do build |
| `npm run typecheck` | Executa a verificação de TypeScript |
| `npm run lint` | Executa o Oxlint |
| `npm run test:e2e` | Executa os testes Playwright |
| `npm run test:e2e:headed` | Executa os testes com navegador visível |
| `npm run test:e2e:report` | Abre o relatório do Playwright |
| `npm run audit:lighthouse` | Executa a auditoria Lighthouse |

Para executar os testes E2E, instale também os navegadores do Playwright, caso ainda não estejam disponíveis:

```bash
npx playwright install chromium
```

### Auditoria Lighthouse

Instale a dependência de auditoria:

```bash
npm install -D lighthouse
```

Gere o build:

```bash
npm run build
```

Inicie o preview em um terminal:

```bash
npm run preview
```

Em outro terminal, execute:

```bash
npm run audit:lighthouse
```

O relatório HTML é gerado em `lighthouse-report.html`.

---

## 6. Dados simulados e cenários

Os dados do marketplace são fornecidos por fixtures locais e handlers do MSW.

Os principais dados persistidos no navegador utilizam as seguintes chaves:

| Chave | Conteúdo |
|---|---|
| `kurio-users` | Colecionadores cadastrados |
| `kurio-session` | Sessão atual |
| `kurio-cart:<collectorId>` | Carrinho por colecionador |
| `kurio-cart:guest` | Carrinho de visitante |
| `kurio-inventory` | Estoque atualizado |
| `kurio-orders` | Histórico de pedidos |
| `kurio-wallets` | Carteiras cadastradas |

### Credenciais fictícias

Não existe uma conta de demonstração fixa obrigatória.

Para testar a aplicação:

1. Acesse a tela de cadastro.
2. Informe um nome, e-mail e senha fictícios.
3. Finalize o cadastro.
4. Utilize as mesmas credenciais para realizar login posteriormente.

Os dados são armazenados localmente no navegador.

### Cupons disponíveis

| Cupom | Desconto |
|---|---:|
| `KURIO10` | 10% |
| `KURIO20` | 20% |

### Reset dos cenários

Para começar novamente com os dados iniciais:

1. Abra as ferramentas de desenvolvedor do navegador (`F12`).
2. Acesse a aba **Application**.
3. Abra **Local Storage**.
4. Selecione o domínio da aplicação.
5. Limpe os dados armazenados.
6. Recarregue a página.

Isso remove os usuários, sessão, carrinhos, carteiras, pedidos e alterações de estoque armazenadas naquele navegador.

---

## 7. Reprodução de cenários de falha

Os seguintes cenários podem ser reproduzidos pela interface:

| Cenário | Como reproduzir | Resultado esperado |
|---|---|---|
| Login inválido | Informar e-mail ou senha incorretos | Mensagem de autenticação inválida |
| E-mail duplicado | Cadastrar novamente um e-mail existente | Requisição rejeitada |
| Carrinho vazio | Acessar o checkout sem itens | Compra não permitida |
| Estoque insuficiente | Tentar adicionar mais unidades que o estoque disponível | Operação rejeitada |
| Quantidade inválida | Enviar quantidade maior que o estoque pela API simulada | Resposta HTTP 409 |
| Cupom inválido | Informar um código inexistente | Mensagem de cupom inválido |
| Carteira não selecionada | Tentar pagar com carteira sem selecionar uma | Compra não permitida |
| Usuário não autenticado | Acessar rotas protegidas sem sessão | Redirecionamento para login |

Os handlers MSW simulam respostas HTTP de sucesso e falha, permitindo validar os fluxos sem backend real.

---

## 8. Rotas da aplicação

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Página inicial e catálogo | Público |
| `/nft/:nftId` | Detalhes de um NFT | Público |
| `/cart` | Carrinho de compras | Público |
| `/login` | Login | Público |
| `/register` | Cadastro | Público |
| `/account` | Conta do colecionador | Autenticado |
| `/checkout` | Finalização da compra | Autenticado |

As rotas são gerenciadas pelo TanStack Router.

---

## 9. Testes automatizados

A suíte E2E utiliza Playwright com Chromium.

Execute todos os testes:

```bash
npm run test:e2e
```

Execute com navegador visível:

```bash
npm run test:e2e:headed
```

Os testes cobrem:

- Carregamento da página inicial.
- Proteção de rotas.
- Cadastro e login.
- Persistência da sessão após atualização.
- Operações do carrinho.
- Validação de estoque.
- Finalização de compra.
- Aplicação de cupom.
- Atualização do estoque após compra.
- Histórico de compras.

### Resultado validado

Na execução local registrada durante o desenvolvimento:

```text
Running 15 tests

15 passed
```

---

## 10. Limitações e escopo

Este projeto utiliza serviços simulados para reproduzir os fluxos esperados de um marketplace.

Não fazem parte do escopo:

- Integração real com blockchain.
- Conexão com extensões de carteira.
- Transações reais em Ethereum ou Polygon.
- Gateway de pagamento real.
- Backend de produção.
- Persistência compartilhada entre dispositivos ou navegadores.

Os dados de cadastro, sessão, carrinho, carteira, estoque e pedidos são armazenados no `localStorage` do navegador.

As credenciais e os mecanismos de autenticação são exclusivamente demonstrativos e não devem ser utilizados em produção real.

---

## 11. Publicação

A aplicação está publicada na Vercel:

**https://kurio-nft-marketplace-sand.vercel.app**

O deploy é realizado a partir da branch `main` do repositório GitHub.

O MSW é inicializado também no ambiente publicado, permitindo executar os fluxos simulados sem depender de serviços externos.

---

## 12. Autor

Desenvolvido por **Raphael Brunetto**.

- GitHub: https://github.com/Raphabrunetto
- Repositório do projeto: https://github.com/Raphabrunetto/FrontChallengeKurio
