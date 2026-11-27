# Kurio NFT Marketplace

Marketplace demonstrativo de NFTs desenvolvido com React, TypeScript e Vite, com API em Node.js/Express e integração de desenvolvimento via Socket.IO.

## Links

- **Aplicação:** https://kurio-nft-marketplace-sand.vercel.app
- **API:** https://frontchallengekurio.onrender.com
- **Repositório:** https://github.com/Raphabrunetto/FrontChallengeKurio

> Se os domínios de deploy forem alterados, atualize esta seção e as variáveis de ambiente.

O projeto oferece dois modos: MSW para demonstração e API Express para integração real. Em produção, o MSW é o padrão para que o deploy funcione sem depender do serviço de backend; `VITE_ENABLE_MOCKS=false` seleciona a API real. Em desenvolvimento, o padrão é usar a API local, e `VITE_ENABLE_MOCKS=true` ativa a simulação. A API Express cobre autenticação, catálogo e carrinho; checkout, carteiras e histórico de pedidos estão disponíveis apenas no modo MSW.

## Tecnologias

**Front-end**
- React 19 e TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (padrões de botão, seleção e foco adaptados ao tema Kurio)
- TanStack Router e TanStack Query
- Axios
- Socket.IO Client
- MSW para simular autenticação, catálogo, carrinho/checkout e carteiras no modo de demonstração

**Back-end**
- Node.js e Express
- Socket.IO
- CORS
- Estruturas em memória (`Map`)

**Deploy**
- Vercel: front-end
- Render: API e servidor Socket.IO

## Funcionalidades

- Catálogo de NFTs consumido pela API.
- Busca, categorias, ordenação e filtros de preço.
- Visualização de informações dos NFTs.
- Carrosséis de recomendações nos detalhes e no carrinho.
- Carrinho com inclusão, atualização de quantidade e remoção de itens.
- API REST para catálogo e carrinho.
- Integração de desenvolvimento via Socket.IO para atualização de NFTs ao usar a API Express.
- Interface responsiva.
- Cadastro, login, consulta de sessão e logout por MSW ou API Express.

**Nota:** carteiras e checkout ainda são demonstrativos e não estão integralmente conectados e persistidos no back-end.

O fluxo de pedidos e a gestão de carteiras também usam handlers MSW. A API Express deste repositório não expõe rotas de checkout, carteiras ou histórico de pedidos.

Busca, filtros, ordenação e carrinho usam interações inspiradas nos padrões de shadcn/ui, adaptadas com Tailwind CSS, transições leves e suporte à preferência por movimento reduzido.

## Estrutura

```text
.
├── server/
│   ├── data/
│   │   └── nfts.json
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── dev.js
│   │   ├── nfts.js
│   │   └── orders.js
│   ├── index.js
│   ├── socket.js
│   └── store.js
├── src/
│   ├── app/
│   │   ├── providers/
│   │   └── router/
│   ├── features/
│   ├── mocks/
│   ├── services/
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Requisitos

- Node.js (versão LTS recente recomendada)
- npm

## Executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/Raphabrunetto/FrontChallengeKurio.git
cd FrontChallengeKurio
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001
VITE_REALTIME_URL=http://localhost:3001
```

As variáveis `VITE_*` são incluídas no bundle do navegador. Não coloque senhas, tokens privados ou segredos nelas.

O backend local é usado por padrão durante o desenvolvimento. Para simular os endpoints de autenticação, adicione `VITE_ENABLE_MOCKS=true` ao `.env`. Para testar o backend real, use `VITE_ENABLE_MOCKS=false`.

### 4. Iniciar o back-end

Em um terminal:

```bash
npm run server
```

A API ficará disponível em `http://localhost:3001`.

- Health check: `http://localhost:3001/health`
- Catálogo: `http://localhost:3001/api/nfts`

A rota `/` não serve uma página HTML: o servidor é uma API.

### 5. Iniciar o front-end

Em outro terminal:

```bash
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

Mantenha os dois terminais ativos durante o desenvolvimento.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o Vite |
| `npm run server` | Inicia Express e Socket.IO |
| `npm run dev:all` | Inicia front-end e backend em paralelo |
| `npm run build` | Verifica os tipos e gera o build |
| `npm run typecheck` | Executa a verificação TypeScript |
| `npm run lint` | Executa o Oxlint |
| `npm run test:e2e` | Executa a suíte E2E Playwright com MSW |
| `npm run test:e2e:headed` | Executa a suíte E2E com navegador visível |
| `npm run test:e2e:report` | Abre o relatório HTML da última execução |

## Testes E2E

Instale o navegador Chromium do Playwright uma vez após instalar as dependências:

```bash
npx playwright install chromium
```

Execute toda a suíte com:

```bash
npm run test:e2e
```

O Playwright inicia o Vite automaticamente e ativa o MSW para que os testes usem dados simulados e reproduzíveis, sem precisar iniciar o backend. O relatório HTML é gerado em `playwright-report/`; para abri-lo, use `npm run test:e2e:report`. Para executar um arquivo específico, por exemplo:

```bash
npx playwright test tests/e2e/auth.spec.ts
```

Última validação local: **18 testes passaram** (`npm run test:e2e`, Chromium, 27/11/2026).

O teste `responsive.spec.ts` também percorre login, cadastro, conta, início, detalhe, carrinho e checkout em larguras de 320, 375 e 390 px, verifica que nenhuma rota cria rolagem horizontal e confirma que os carrosséis aparecem nos detalhes e no carrinho.

## Deploy

### Back-end — Render

Configure o serviço Node.js:

- **Build Command:** `npm install`
- **Start Command:** `npm run server`

Adicione a variável:

```env
CLIENT_ORIGIN=https://SEU-DOMINIO-VERCEL.vercel.app
```

Se precisar liberar mais de uma origem, informe os domínios separados por vírgula, conforme a configuração CORS do servidor.

Após o deploy, teste:

```text
https://SEU-SERVICO.onrender.com/health
https://SEU-SERVICO.onrender.com/api/nfts
```

### Front-end — Vercel

Importe o repositório na Vercel e configure as variáveis de ambiente para Production (e Preview, se necessário):

```env
VITE_API_URL=https://SEU-SERVICO.onrender.com
VITE_REALTIME_URL=https://SEU-SERVICO.onrender.com
```

Substitua `SEU-SERVICO` pelo domínio real do Render. Não acrescente `/api` ao final.

Depois de salvar as variáveis, faça um novo deploy para que o Vite incorpore os valores ao bundle. O domínio configurado em `CLIENT_ORIGIN` no Render deve corresponder ao domínio pelo qual o usuário acessa o front-end.

O build de produção ativa os handlers REST do MSW por padrão, então a demonstração não depende do deploy do backend. Configure `VITE_ENABLE_MOCKS=false` na Vercel para usar a API Express real. O backend real mantém contas e sessões em memória; contas podem ser perdidas quando o serviço reiniciar.

## Endpoints da API

### Autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Cria uma conta e inicia a sessão |
| `POST` | `/api/auth/login` | Valida as credenciais e inicia a sessão |
| `GET` | `/api/auth/me` | Retorna a conta da sessão autenticada |
| `POST` | `/api/auth/logout` | Encerra a sessão autenticada |

No modo Express, o frontend guarda o token de sessão no navegador e o envia como `Authorization: Bearer <token>` nas chamadas à API. Senhas são armazenadas como hash no backend. No modo MSW, usuários de demonstração e sessão ficam no `localStorage` do navegador.

### NFTs

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/nfts` | Lista NFTs e aceita parâmetros de consulta do catálogo |
| `GET` | `/api/nfts/:id` | Busca um NFT pelo identificador |

### Carrinho

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/cart` | Consulta o carrinho |
| `POST` | `/api/cart/items` | Adiciona um NFT |
| `PATCH` | `/api/cart/items/:id` | Atualiza a quantidade |
| `DELETE` | `/api/cart/items/:id` | Remove um item |
| `DELETE` | `/api/cart` | Limpa o carrinho |

### Saúde

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API está ativa |

O servidor inclui eventos Socket.IO para sincronizar alterações de NFTs. A criação de sessão usada pelo cliente realtime depende da rota temporária `/dev/session`, desativada em produção; essa integração ainda não está pronta para uso no deploy de produção.

## Limitações conhecidas

- **Persistência:** o back-end utiliza estruturas em memória (`Map`). Sessões, carrinhos e alterações de estado podem ser perdidos quando o serviço reiniciar ou entrar em suspensão. Não há banco de dados persistente nesta versão.
- **Autenticação:** usuários e sessões também ficam em memória; contas podem ser perdidas quando o processo do backend reiniciar.
- **Pagamentos:** não existe integração com gateway de pagamento real. Os fluxos de pagamento são simulações.
- **Mocks:** os handlers REST simulam autenticação, catálogo, carrinho/checkout e carteiras. O modo de integração real usa a API configurada.
- **API Express:** nesta versão, checkout, carteiras e histórico de pedidos existem somente no modo MSW; não use `VITE_ENABLE_MOCKS=false` para esses fluxos.
- **Tempo real:** o cliente Socket.IO está implementado, mas a rota temporária de sessão necessária para conectá-lo é desativada em produção.
- **Render:** dependendo do plano, o serviço pode suspender após inatividade; a primeira requisição pode demorar alguns instantes.

## Validação antes da entrega

Execute:

```bash
npm run typecheck
npm run lint
npm run build
```

Avisos do lint não necessariamente impedem o build. Corrija erros de TypeScript ou falhas de build antes de publicar.

---

Desenvolvido por **Raphael Brunetto**.
