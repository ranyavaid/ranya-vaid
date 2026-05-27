import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = {
  /** Optional icon rendered before the label (24px sparkle by default). */
  icon?: ReactNode
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Button
 * Tactile, keyboard-key style button:
 *   • rests with a hard 0 4px 0 black shadow underneath
 *   • on hover, lifts (translateY(-2px)) and the shadow grows to 6px
 *   • on press, snaps down (translateY(4px)) and the shadow collapses,
 *     so the key feels like it bottoms-out against the surface.
 */
export function Button({ icon, children, className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  )
}
