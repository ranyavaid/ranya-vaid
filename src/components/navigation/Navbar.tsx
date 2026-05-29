import { Container } from '../layout/Container'
import { NavLink } from './NavLink'
import styles from './Navbar.module.css'
import type { MouseEvent } from 'react'

type NavItem = { label: string; href: string }

const NAV_ITEMS: NavItem[] = [
  { label: 'Works', href: '#works' },
  { label: 'Playground', href: '#playground' },
  { label: 'About Me', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Navbar
 * Top-of-page navigation banner. Transparent background so the dotted
 * grid shows through. Respects the page gutter (100px @ 1440px) via
 * `Container`.
 */
export function Navbar() {
  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
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

    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={styles.navbar}>
      <Container>
        <nav className={styles.row} aria-label="Primary">
          <a href="#top" onClick={handleBrandClick} className={`h3 ${styles.brand}`}>
            Ranya Vaid
          </a>

          <ul className={styles.items}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
