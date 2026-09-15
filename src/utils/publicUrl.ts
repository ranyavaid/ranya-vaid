/** Prefix public-folder paths with Vite base (e.g. `/` on Vercel, `/repo/` on GitHub Pages). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
