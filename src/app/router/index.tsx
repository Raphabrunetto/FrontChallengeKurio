
import { useState } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useRouterState,
  Navigate,
} from '@tanstack/react-router'

import { HomePage } from '../../features/catalog/pages/HomePage'
import { NFTDetailsPage } from '../../features/catalog/pages/NFTDetailsPage'
import { CartPage } from '../../features/cart/pages/CartPage'
import { CheckoutPage } from '../../features/cart/pages/CheckoutPage'
import { LoginPage } from '../../features/account/pages/LoginPage'
import { RegisterPage } from '../../features/account/pages/RegisterPage'
import { AccountPage } from '../../features/account/pages/AccountPage'

import { Footer } from '../../components/shared/footer'
import { FooterVisibilityContext } from '../../components/shared/FooterVisibilityContext'
import { useAuth } from '../../features/account/hooks/useAuth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#100d0b] text-[#f0e5d5]">
        Verificando autenticação...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function ProtectedAccountPage() {
  return (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  )
}

function ProtectedCheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  )
}

function RootLayout() {
  const [hideFooterByState, setHideFooterByState] = useState(false)

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const hiddenRoutes = ['/login', '/register', '/account']

  const hideFooter =
    hiddenRoutes.includes(pathname) || hideFooterByState

  return (
    <FooterVisibilityContext.Provider value={setHideFooterByState}>
      <main className="min-h-screen bg-[#100d0b] text-[#f0e5d5]">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </FooterVisibilityContext.Provider>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: NFTDetailsPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: ProtectedCheckoutPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: ProtectedAccountPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  nftDetailsRoute,
  cartRoute,
  checkoutRoute,
  loginRoute,
  registerRoute,
  accountRoute,
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
