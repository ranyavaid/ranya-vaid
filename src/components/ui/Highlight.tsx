import type { ReactNode } from 'react'
import styles from './Highlight.module.css'

type HighlightProps = {
  children: ReactNode
}

/**
 * Highlight
 * Wraps inline content in a yellow tag with a thin golden border and four
 * Figma-style selection-handle squares at the corners — a playful nod to
 * design-tool UI for any "Product Designer" copy.
 */
export function Highlight({ children }: HighlightProps) {
  return (
    <span className={styles.highlight}>
      <span className={styles.content}>{children}</span>
      <span className={styles.handle} data-corner="tl" aria-hidden="true" />
      <span className={styles.handle} data-corner="tr" aria-hidden="true" />
      <span className={styles.handle} data-corner="bl" aria-hidden="true" />
      <span className={styles.handle} data-corner="br" aria-hidden="true" />
    </span>
  )
}
