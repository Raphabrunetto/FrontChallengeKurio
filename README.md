# Kurio NFT Marketplace

Marketplace demonstrativo de NFTs desenvolvido com React, TypeScript e Vite, com API própria em Node.js/Express e comunicação em tempo real via Socket.IO.

## Links

- **Aplicação:** https://kurio-nft-marketplace-sand.vercel.app
- **API:** https://frontchallengekurio.onrender.com
- **Repositório:** https://github.com/Raphabrunetto/FrontChallengeKurio

> Se os domínios de deploy forem alterados, atualize esta seção e as variáveis de ambiente.

Cadastro e autenticação usam a API Express. O MSW só é iniciado localmente quando `VITE_ENABLE_MOCKS=true`; esse modo serve para testar os handlers simulados.

## Tecnologias

**Front-end**
- React 19 e TypeScript
- Vite
- Tailwind CSS
- TanStack Router e TanStack Query
- Axios
- Socket.IO Client
- MSW para simular autenticação localmente, quando habilitado

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
- Carrinho com inclusão, atualização de quantidade e remoção de itens.
- API REST para catálogo e carrinho.
- Comunicação em tempo real para atualização de NFTs.
- Interface responsiva.
- Cadastro, login, consulta de sessão e logout pela API.

**Nota:** carteiras e checkout ainda são demonstrativos e não estão integralmente conectados e persistidos no back-end.

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

O backend local é usado por padrão durante o desenvolvimento. Para simular os endpoints de autenticação, adicione `VITE_ENABLE_MOCKS=true` ao `.env`.

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

## Endpoints da API

### Autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Cria uma conta e inicia a sessão |
| `POST` | `/api/auth/login` | Valida as credenciais e inicia a sessão |
| `GET` | `/api/auth/me` | Retorna a conta da sessão autenticada |
| `POST` | `/api/auth/logout` | Encerra a sessão autenticada |

O frontend guarda o token de sessão no navegador e o envia como `Authorization: Bearer <token>` nas chamadas à API. Senhas são armazenadas como hash no backend.

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

O servidor também disponibiliza eventos Socket.IO para sincronização em tempo real, conforme a implementação atual.

## Limitações conhecidas

- **Persistência:** o back-end utiliza estruturas em memória (`Map`). Sessões, carrinhos e alterações de estado podem ser perdidos quando o serviço reiniciar ou entrar em suspensão. Não há banco de dados persistente nesta versão.
- **Autenticação:** usuários e sessões também ficam em memória; contas podem ser perdidas quando o processo do backend reiniciar.
- **Pagamentos:** não existe integração com gateway de pagamento real. Os fluxos de pagamento são simulações.
- **Mocks:** MSW só é iniciado em desenvolvimento quando `VITE_ENABLE_MOCKS=true`.
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
