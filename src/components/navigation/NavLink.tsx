import type { MouseEvent, ReactNode } from 'react'
import { scrollToHashTarget } from '../../utils/scrollReset'
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
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    if (href.startsWith('#') && scrollToHashTarget(href, 'smooth')) {
      event.preventDefault()
    }
  }

  return (
    <a href={href} onClick={handleClick} className={`h3 ${styles.link}`}>
      <span className={styles.label}>{children}</span>
    </a>
  )
}
