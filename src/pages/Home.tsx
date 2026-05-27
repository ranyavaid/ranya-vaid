import { useEffect, useRef } from 'react'
import { AboutMeSection } from '../components/about/AboutMeSection'
import { ContactSection } from '../components/contact/ContactSection'
import { DesignQuestsSection } from '../components/design-quests/DesignQuestsSection'
import { Container } from '../components/layout/Container'
import { Hero } from '../components/hero/Hero'
import { StackSection } from '../components/stack/StackSection'
import { WorksSection } from '../components/works/WorksSection'
import styles from './Home.module.css'

/**
 * Home
 * The landing page. Wraps page-level sections in `<Container>` so they
 * pick up the 100px @ 1440px gutter automatically.
 */
export function Home() {
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    const sections = Array.from(main.querySelectorAll('section'))
    if (sections.length === 0) return

    sections.forEach((section) => {
      section.classList.add(styles.sectionReveal)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add(styles.sectionVisible)
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
      sections.forEach((section) => {
        section.classList.remove(styles.sectionReveal, styles.sectionVisible)
      })
    }
  }, [])

  return (
    <main ref={mainRef}>
      <Container>
        <Hero />
        <WorksSection />
        <StackSection />
        <DesignQuestsSection />
        <AboutMeSection />
        <ContactSection />
        <footer className={styles.footer}>
          Built with ❤︎ Ranya Vaid
        </footer>
      </Container>
    </main>
  )
}
