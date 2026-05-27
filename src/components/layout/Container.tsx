import type { ElementType, ReactNode } from 'react'
import styles from './Container.module.css'

type ContainerProps = {
  as?: ElementType
  children: ReactNode
  className?: string
}

/**
 * Container
 * Centers content inside a max-width of 1440px with responsive side gutters.
 * On a 1440px screen the gutter is 100px (so content is 1240px wide); below
 * that it scales fluidly down to a 20px minimum on mobile. Use this wherever
 * you want page-level horizontal alignment.
 */
export function Container({
  as: Tag = 'div',
  children,
  className,
}: ContainerProps) {
  return (
    <Tag className={[styles.container, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
