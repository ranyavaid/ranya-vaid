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

const HOME_RETURN_HASH_KEY = 'portfolio:homeReturnHash'
const HOME_SECTION_IDS = new Set(['top', 'works', 'playground', 'about', 'contact'])

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized.length === 0 ? '/' : normalized
}

function resolveNextPath(url: string | URL | null | undefined) {
  if (!url) return null

  try {
    return normalizePathname(new URL(url.toString(), window.location.href).pathname)
  } catch {
    return null
  }
}

function captureHomeReturnHash() {
  const id = window.location.hash.replace(/^#/, '')
  const hash = id && HOME_SECTION_IDS.has(id) ? `#${id}` : '#works'
  sessionStorage.setItem(HOME_RETURN_HASH_KEY, hash)
}

/** Hash to restore when returning home from a case study. */
export function getHomeReturnHash() {
  return sessionStorage.getItem(HOME_RETURN_HASH_KEY) ?? '#works'
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
    const fromPath = normalizePathname(window.location.pathname)
    const nextPath = resolveNextPath(args[2] as string | URL | null | undefined)

    if (fromPath === '/' && nextPath?.startsWith('/works/')) {
      captureHomeReturnHash()
    }

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
