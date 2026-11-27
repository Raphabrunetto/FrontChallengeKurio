import { createContext, useContext } from 'react'

export const FooterVisibilityContext = createContext<
  (hidden: boolean) => void
>(() => {})

export function useFooterVisibility() {
  return useContext(FooterVisibilityContext)
}