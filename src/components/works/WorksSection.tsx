import { Notebook } from './Notebook'
import { FEATURED_CASES } from './worksData'
import styles from './WorksSection.module.css'

/**
 * WorksSection
 * Featured case-study notebooks with project imagery and hover lift.
 */
export function WorksSection() {
  return (
    <section id="works" className={styles.section} aria-labelledby="works-heading">
      <header className={styles.header}>
        <h2 id="works-heading" className={styles.heading}>
          Featured Cases
        </h2>
        <p className={`body-1 ${styles.subtext}`}>
          Over time, I’ve had the opportunity to work across a range of
          products and problem spaces. Here are a few projects I especially
          enjoyed building.
        </p>
      </header>

      <div className={styles.notebooks} aria-label="Featured case folders">
        {FEATURED_CASES.map((workCase) => (
          <Notebook key={workCase.id} {...workCase} />
        ))}
      </div>
    </section>
  )
}
