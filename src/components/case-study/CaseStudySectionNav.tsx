import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import styles from './CaseStudySectionNav.module.css'

export type CaseStudySection = {
  id: string
  label: string
}

type CaseStudySectionNavProps = {
  sections: CaseStudySection[]
  bannerRef?: RefObject<HTMLElement | null>
  ariaLabel?: string
}

/**
 * Fixed right-rail section navigator: collapsed tick marks expand on hover
 * to reveal section labels with scroll-spy highlighting.
 */
export function CaseStudySectionNav({
  sections,
  bannerRef,
  ariaLabel = 'Case study sections',
}: CaseStudySectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const [pressedId, setPressedId] = useState<string | null>(null)
  const [isPastBanner, setIsPastBanner] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.getElementById(id)
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (!bannerRef) {
      setIsPastBanner(true)
      return
    }

    const banner = bannerRef.current
    if (!banner) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setIsPastBanner(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(banner)
    return () => observer.disconnect()
  }, [bannerRef])

  useEffect(() => {
    const contentSections = sections.filter((section) => section.id !== 'top')
    const sectionElements = contentSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)

    if (sectionElements.length === 0) return

    const lastSectionId = contentSections[contentSections.length - 1]?.id
    /** Extra scroll room for footers / bottom padding (all case study pages). */
    const bottomScrollSlackPx = 200

    const applyEndOfPageSection = () => {
      const remaining =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      if (remaining > bottomScrollSlackPx) return false

      // Prefer the lowest section still in view so Impact does not stay active over Learnings / Next steps.
      for (let i = contentSections.length - 1; i >= 0; i--) {
        const id = contentSections[i].id
        const el = document.getElementById(id)
        if (!el) continue
        const { top, bottom } = el.getBoundingClientRect()
        if (bottom > 0 && top < window.innerHeight) {
          setActiveId(id)
          return true
        }
      }

      if (lastSectionId) {
        setActiveId(lastSectionId)
        return true
      }
      return false
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (applyEndOfPageSection()) return

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const topEntry = visibleEntries[0]
        if (topEntry?.target.id) {
          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: '-24% 0px -52% 0px',
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      }
    )

    sectionElements.forEach((element) => observer.observe(element))

    const handleScroll = () => {
      if (window.scrollY < 160) {
        setActiveId('top')
        return
      }

      applyEndOfPageSection()
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [sections])

  const handlePointerDown = (id: string) => {
    setPressedId(id)
  }

  const clearPressed = () => {
    setPressedId(null)
  }

  return (
    <nav
      ref={navRef}
      className={`${styles.sectionNav} ${isPastBanner ? styles.sectionNavVisible : ''}`}
      aria-label={ariaLabel}
      aria-hidden={!isPastBanner}
    >
      <div className={styles.sectionNavPanel}>
        <ol className={styles.sectionNavList}>
          {sections.map((section) => {
            const isActive = activeId === section.id
            const isPressed = pressedId === section.id

            return (
              <li key={section.id} className={styles.sectionNavItemWrap}>
                <button
                  type="button"
                  className={`${styles.sectionNavItem} body-2 ${
                    isActive ? styles.sectionNavItemActive : ''
                  } ${isPressed ? styles.sectionNavItemPressed : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => scrollToSection(section.id)}
                  onPointerDown={() => handlePointerDown(section.id)}
                  onPointerUp={clearPressed}
                  onPointerCancel={clearPressed}
                  onPointerLeave={clearPressed}
                >
                  <span
                    className={`${styles.sectionNavTick} ${
                      isActive ? styles.sectionNavTickActive : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span className={styles.sectionNavLabel}>{section.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
