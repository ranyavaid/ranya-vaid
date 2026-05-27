import styles from './AboutMeSection.module.css'

/**
 * AboutMeSection
 * Intro section with heading, body copy, and the about-me collage image.
 */
export function AboutMeSection() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-me-heading">
      <header className={styles.header}>
        <h2 id="about-me-heading" className={styles.heading}>
          About Me
        </h2>
        <p className={`body-1 ${styles.subtext}`}>
          I love tinkering and experimenting, which is probably why I’ve grown
          into someone with many different facets, both as a designer and as a
          person.
        </p>
      </header>

      <img
        src="/about-me.png"
        alt="About me collage"
        className={styles.image}
        draggable={false}
      />
    </section>
  )
}
