import { Link, useLocation } from 'react-router-dom'
import { Container } from '../layout/Container'
import { getHomeReturnHash } from '../../utils/scrollReset'
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
  const { pathname: rawPathname } = useLocation()
  const pathname = rawPathname.replace(/\/+$/, '') || '/'
  const isHomePage = pathname === '/'
  const isCaseStudyPage = pathname.startsWith('/works/')
  const homeReturnHash = getHomeReturnHash().replace(/^#/, '')
  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    href: isHomePage ? item.href : `/${item.href}`,
  }))

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isHomePage) {
      return
    }

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
        <nav
          className={`${styles.row} ${isCaseStudyPage ? styles.rowCaseStudy : ''}`}
          aria-label="Primary"
        >
          {isCaseStudyPage ? (
            <Link to={{ pathname: '/', hash: homeReturnHash }} className={`h3 ${styles.backHome}`}>
              <span className={styles.backHomeIcon} aria-hidden="true">
                arrow_back_ios
              </span>
              <span className={styles.backHomeLabel}>Back to home</span>
            </Link>
          ) : (
            <>
              <a
                href={isHomePage ? '#top' : '/'}
                onClick={handleBrandClick}
                className={`h3 ${styles.brand}`}
              >
                Ranya Vaid
              </a>

              <ul className={styles.items}>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
      </Container>
    </header>
  )
}
