import type { ReactNode } from 'react'
import styles from './NavLink.module.css'

type NavLinkProps = {
  href: string
  children: ReactNode
}

/**
 * NavLink
 * An H3-styled anchor that reveals a blue strikethrough over the text
 * on hover/focus. The line is a CSS pseudo-element on `.label` that
 * animates `scaleX` from 0 → 1 with a left transform-origin, so it
 * "draws in" from the start of the word.
 */
export function NavLink({ href, children }: NavLinkProps) {
  return (
    <a href={href} className={`h3 ${styles.link}`}>
      <span className={styles.label}>{children}</span>
    </a>
  )
}
