import { useState } from 'react'
import styles from './FortuneCookie.module.css'

/**
 * FortuneCookie
 * A small interactive decorative model for the contact section.
 * Clicking toggles an "opened" state where the cookie halves split and a
 * fortune note slides out.
 */
export function FortuneCookie() {
  const [opened, setOpened] = useState(false)

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpened((prev) => !prev)}
        aria-pressed={opened}
        aria-label={opened ? 'Close fortune cookie' : 'Open fortune cookie'}
      >
        <div className={`${styles.cookie} ${opened ? styles.cookieOpened : ''}`}>
          <span className={`${styles.half} ${styles.halfLeft}`} aria-hidden="true" />
          <span className={`${styles.half} ${styles.halfRight}`} aria-hidden="true" />
          <span className={styles.crack} aria-hidden="true" />
        </div>

        <span className={`${styles.fortune} ${opened ? styles.fortuneVisible : ''}`}>
          Let&apos;s build something memorable.
        </span>
      </button>
    </div>
  )
}
