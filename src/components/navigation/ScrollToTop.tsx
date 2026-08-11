import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { resetRouteScroll } from '../../utils/scrollReset'

/**
 * Resets window scroll on every route change before paint.
 * Preserves intentional hash navigation (#works, #contact, etc.).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    resetRouteScroll(hash)
  }, [pathname, hash])

  return null
}
