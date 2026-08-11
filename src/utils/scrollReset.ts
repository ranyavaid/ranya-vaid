/**
 * Scroll reset that bypasses global `scroll-behavior: smooth`.
 */
export function resetScrollInstant() {
  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior

  root.style.scrollBehavior = 'auto'
  root.scrollTop = 0
  document.body.scrollTop = 0
  window.scrollTo(0, 0)
  root.style.scrollBehavior = previousScrollBehavior
}

/**
 * Scroll to an in-page hash target. Returns true when the hash was handled.
 */
export function scrollToHashTarget(
  hash: string,
  behavior: ScrollBehavior = 'auto',
) {
  const id = hash.replace(/^#/, '')
  if (id.length === 0 || id === 'top') {
    resetScrollInstant()
    return true
  }

  const target = document.getElementById(id)
  if (!target) {
    return false
  }

  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior

  root.style.scrollBehavior = behavior
  target.scrollIntoView({ behavior, block: 'start' })
  root.style.scrollBehavior = previousScrollBehavior
  return true
}

/** Route entry scroll: hash sections when present, otherwise top. */
export function resetRouteScroll(hash: string) {
  if (hash && scrollToHashTarget(hash, 'auto')) {
    return
  }

  resetScrollInstant()
}

let historyScrollPatchApplied = false

/**
 * React Router navigates via history.pushState/replaceState without resetting
 * scroll. Patch those APIs so scrollY is 0 before the route commit paints.
 */
export function patchHistoryScrollReset() {
  if (historyScrollPatchApplied || typeof window === 'undefined') return
  historyScrollPatchApplied = true

  const { pushState, replaceState } = history

  history.pushState = function pushStateWithScrollReset(...args) {
    resetScrollInstant()
    return pushState.apply(this, args)
  }

  history.replaceState = function replaceStateWithScrollReset(...args) {
    resetScrollInstant()
    return replaceState.apply(this, args)
  }
}

/**
 * Disable browser scroll restoration so SPA navigations always start from
 * scrollY = 0 unless a hash target is handled after route commit.
 */
export function disableBrowserScrollRestoration() {
  if (typeof window === 'undefined') return
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
}
