function detectAssetBaseFromPage(): string | null {
  if (typeof document === 'undefined') return null

  const moduleScript = document.querySelector(
    'script[type="module"][src*="/assets/"]',
  ) as HTMLScriptElement | null
  if (!moduleScript?.src) return null

  try {
    const scriptPath = new URL(moduleScript.src, window.location.href).pathname
    const assetsIndex = scriptPath.indexOf('/assets/')
    if (assetsIndex <= 0) return null
    return scriptPath.slice(0, assetsIndex + 1)
  } catch {
    return null
  }
}

/** Prefix public-folder paths with Vite base (e.g. `/` on Vercel, `/repo/` on GitHub Pages). */
export function publicUrl(path: string): string {
  const envBase = import.meta.env.BASE_URL || '/'
  const base = envBase !== '/' ? envBase : detectAssetBaseFromPage() ?? envBase
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
