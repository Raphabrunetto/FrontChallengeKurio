
# Architecture — Kurio NFT Marketplace

## 1. Overview

Kurio is a frontend NFT marketplace developed with React, TypeScript and Vite.

The application uses a mock REST API powered by Mock Service Worker (MSW), allowing the main marketplace flows to work without depending on a private backend.

The architecture separates the application into pages, features, shared components, API services, providers and mock handlers.

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
- Socket.IO Client (dependency available; active integration must be verified)

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

The frontend communicates through REST-style endpoints intercepted by MSW.

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

### Cart and Orders

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/cart` | Retrieve the current cart |
| POST | `/api/cart/items` | Add an item |
| PATCH | `/api/cart/items/:id` | Update item quantity |
| DELETE | `/api/cart/items/:id` | Remove an item |
| DELETE | `/api/cart` | Clear the cart |
| POST | `/api/checkout` | Complete a purchase |
| GET | `/api/orders` | Retrieve order history |

### Wallets

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/wallets` | List user wallets |
| POST | `/api/wallets` | Create a wallet |
| PUT | `/api/wallets/:id` | Update a wallet |
| DELETE | `/api/wallets/:id` | Remove a wallet |

## 6. Authentication and Session Policy

Authentication is simulated through MSW.

User and session information are persisted in browser localStorage.

Relevant storage keys:

- `kurio-users`: registered mock users.
- `kurio-session`: current mock session.

TanStack Query manages the authenticated user state through the `['auth', 'user']` query key.

The authentication query uses a five-minute stale time and disables automatic retries.

This is a frontend simulation and must not be considered production-grade authentication or authorization.

## 7. Cart and Inventory State

Cart data is persisted separately for each user.

Storage keys:

- `kurio-cart:<collectorId>`: authenticated user's cart.
- `kurio-cart:guest`: guest cart.
- `kurio-inventory`: available NFT inventory.

TanStack Query manages cart data and mutations.

The cart query key identifies the current collector:

- `['cart', userId]`
- `['cart', 'guest']`

Cart mutations update or invalidate the relevant query data to keep the interface synchronized.

## 8. Checkout Flow

The checkout process is simulated by the mock API.

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

Orders are persisted in localStorage under `kurio-orders`.

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

This setup allows the deployed application to run without an external backend.

The same mock handlers are used to reproduce the main application scenarios during development and testing.

## 11. Real-Time Communication

The project includes the `socket.io-client` dependency.

However, the presence of the dependency alone does not establish an active Socket.IO integration.

The current mock REST architecture does not depend on a live Socket.IO server.

Consequently, real-time server events and reconciliation between REST responses and Socket.IO events are not part of the confirmed implementation.

A future backend integration could introduce server events for inventory changes, order updates and other marketplace activity.

## 12. UX Decisions

The interface prioritizes:

- Clear NFT discovery and browsing.
- Search, category and sorting controls.
- Visible cart feedback.
- Clear checkout totals and fees.
- Purchase confirmation.
- Account and order history access.
- Consistent loading, empty and error states.

The mock architecture allows the main user journeys to be demonstrated without external service dependencies.

## 13. Limitations

- API responses are simulated by MSW.
- Authentication is not backed by a secure identity provider.
- User, cart, inventory and order persistence relies on browser localStorage.
- No real blockchain transaction is performed.
- No real cryptocurrency payment is processed.
- No live backend or confirmed Socket.IO event integration is required.
- Data is local to the browser and is not shared between users or devices.

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

The deployed frontend uses MSW and does not require private backend credentials.
