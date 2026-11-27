
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { router } from './app/router'
import { QueryProvider } from './app/providers/QueryProvider'

import './index.css'

async function bootstrap() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </React.StrictMode>,
  )
}

void bootstrap().catch((error) => {
  console.error('Falha ao inicializar a aplicação:', error)
})
