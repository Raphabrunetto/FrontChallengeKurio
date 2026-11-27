
# Architecture — Kurio NFT Marketplace

## 1. Overview

Kurio is an NFT marketplace built with React, TypeScript and Vite. It can use either the Express API or Mock Service Worker (MSW), selected through `VITE_ENABLE_MOCKS`.

Production builds use MSW by default so the deployed demo does not depend on a running API. Development uses the local Express API by default. Set `VITE_ENABLE_MOCKS=true` to use MSW in development, or `VITE_ENABLE_MOCKS=false` to select the API in production.

The Express API currently implements authentication, NFT catalog and cart routes. Checkout, wallets and order history are implemented by MSW only.

## 2. Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- TanStack Router
- TanStack Query
- Axios
- Mock Service Worker (MSW)
- React Hook Form
- Zod
- Decimal.js
- Socket.IO Client (realtime client and server code are present; production session bootstrap is not enabled)

## 3. Application Structure

The source code is organized by responsibility:

| Directory | Responsibility |
|---|---|
| `src/app` | Application configuration, router and providers |
| `src/features` | Domain features such as catalog, authentication, cart and account |
| `src/components` | Shared interface components |
| `src/mocks` | MSW setup, handlers and mock API behavior |
| `src` | Application entry point and global styles |

Feature modules keep related components, hooks, types and services together whenever applicable.

## 4. Routing

TanStack Router manages application navigation.

The application includes marketplace, authentication, cart, checkout and account flows.

Routes should be tested both through in-app navigation and direct browser access, including page refreshes.

## 5. API Contracts

The frontend uses the same service layer in both modes. MSW intercepts requests in demo mode; Express serves the implemented routes in backend mode.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/auth/me` | Retrieve the current session |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | End the current session |

### NFT Catalog

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/nfts` | Retrieve NFTs with listing parameters |
| GET | `/api/nfts/:id` | Retrieve NFT details |

The catalog supports parameters such as search, category, sorting, price range, page and limit.

### Cart (Express and MSW)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/cart` | Retrieve the current cart |
| POST | `/api/cart/items` | Add an item |
| PATCH | `/api/cart/items/:id` | Update item quantity |
| DELETE | `/api/cart/items/:id` | Remove an item |
| DELETE | `/api/cart` | Clear the cart |
The following endpoints are handled by MSW, but are not implemented by the Express API in this repository:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/checkout` | Simulate checkout, inventory update and order creation |
| GET | `/api/orders` | Retrieve the current user's simulated order history |
| GET, POST, PUT, DELETE | `/api/wallets` and `/api/wallets/:id` | Manage simulated wallets |

## 6. Authentication and Session Policy

MSW stores demo users and session state in browser `localStorage`. Express validates credentials through its auth routes and keeps users and session tokens in in-memory maps; passwords are hashed by the server.

In mock mode, relevant storage keys include:

- `kurio-users`: registered mock users.
- `kurio-session`: current mock session.

TanStack Query manages the authenticated user state through the `['auth', 'user']` query key.

The authentication query uses a five-minute stale time and disables automatic retries.

The Express authentication flow is an integration example, not a production identity system: data is in memory and is lost when the server restarts.

## 7. Cart and Inventory State

TanStack Query manages cart data and mutations. In MSW mode, cart and inventory are persisted in browser `localStorage`; in Express mode, the cart is stored in server memory.

Mock storage keys:

- `kurio-cart:<collectorId>`: authenticated user's mock cart.
- `kurio-cart:guest`: guest mock cart.
- `kurio-inventory`: simulated available NFT inventory.

TanStack Query manages cart data and mutations.

The cart query key identifies the current collector:

- `['cart', userId]`
- `['cart', 'guest']`

Cart mutations update or invalidate the relevant query data to keep the interface synchronized.

## 8. Checkout Flow

The checkout process is implemented by MSW only. The Express API currently has no checkout route.

The flow includes:

1. Cart validation.
2. Payment method validation.
3. Wallet ownership validation when wallet payment is selected.
4. Coupon validation.
5. Inventory availability validation.
6. Total calculation.
7. Order creation.
8. Inventory update.
9. Cart clearing.

Supported coupon codes:

| Coupon | Discount |
|---|---:|
| `KURIO10` | 10% |
| `KURIO20` | 20% |

A network fee of `0.015 ETH` is included in the checkout calculation.

Decimal.js is used for monetary calculations to avoid common floating-point precision problems.

Mock orders are persisted in localStorage under `kurio-orders`. Wallet validation and payment methods are demonstrations; no blockchain transaction or real payment is made.

## 9. Data Fetching and Cache Strategy

TanStack Query is responsible for asynchronous server state.

The application uses query keys to isolate data by domain and user identity.

Examples:

- `['auth', 'user']`
- `['cart', userId]`
- `['orders', userId]`

Authentication data uses a five-minute stale time.

Order history is configured to refresh when the account page is mounted.

Mutations update or invalidate relevant queries so that the interface reflects changes after operations such as adding items, removing items, updating quantities and completing purchases.

## 10. Mock API Strategy

MSW intercepts HTTP requests and provides deterministic mock responses.

The mock worker is initialized by the application entry point before React is rendered.

This setup allows the deployed application to run without an external backend. The handlers cover authentication, catalog, cart, checkout, wallet and order-history flows.

The same mock handlers reproduce the main application scenarios during development and E2E testing. In production builds, MSW is enabled unless `VITE_ENABLE_MOCKS=false` is set.

## 11. Real-Time Communication

`SocketProvider` connects authenticated users to the configured realtime server, reconciles NFT snapshots and applies `nft.updated` events to TanStack Query caches. The Express server emits those events when its development NFT update route changes an NFT.

The client first requests a token from `/dev/session`. That temporary endpoint is disabled when `NODE_ENV=production`, so the current realtime bootstrap is for development and is not production-ready.

## 12. UX Decisions

The interface prioritizes:

- Clear NFT discovery and browsing.
- Search, category and sorting controls.
- Visible cart feedback.
- Clear checkout totals and fees.
- Purchase confirmation.
- Account and order history access.
- Related NFT scrollers on detail and cart pages.
- Responsive layouts checked at mobile widths of 320, 375 and 390 px.
- Consistent loading, empty and error states.

The mock architecture allows the main user journeys to be demonstrated without external service dependencies.

## 13. Limitations

- MSW is the default for production demos; the Express API is optional.
- Express implements authentication, catalog and cart only; checkout, wallets and order history are MSW-only.
- Express users, sessions, carts and inventory changes are stored in memory and are lost on restart.
- Mock users, carts, inventory, wallets and orders are stored in browser localStorage.
- No real blockchain transaction is performed.
- No real cryptocurrency payment is processed.
- The Socket.IO session bootstrap uses a development-only route and is disabled in production.

## 14. Running the Project

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Run type checking:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run end-to-end tests:

```bash
npm run test:e2e
```

The Playwright suite covers authentication, cart, purchase and inventory flows. The responsive test visits login, registration, account, home, NFT details, cart and checkout at 320, 375 and 390 px, checks for horizontal page overflow, and verifies both recommendation scrollers.

Run tests with the browser visible:

```bash
npm run test:e2e:headed
```

Open the Playwright report:

```bash
npm run test:e2e:report
```

Run Lighthouse audit:

```bash
npm run audit:lighthouse
```

The Lighthouse command expects the preview server to be available at `http://127.0.0.1:4173`.

## 15. Deployment

The application is deployed through Vercel.

Production URL:

https://kurio-nft-marketplace-sand.vercel.app

The deployed frontend uses MSW by default and does not require private backend credentials. Set `VITE_ENABLE_MOCKS=false` only when using Express; checkout, wallet and order-history endpoints are not implemented there.
