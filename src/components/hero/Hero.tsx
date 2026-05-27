import { Button } from '../ui/Button'
import { Highlight } from '../ui/Highlight'
import { PhotoFrame } from '../ui/PhotoFrame'
import { HoverLabel } from './HoverLabel'
import styles from './Hero.module.css'

/**
 * Hero
 * Home-page hero. Two-column layout: text content on the left, a tilted
 * PhotoFrame on the right with a hand-written "Try Hovering!" callout
 * in the gap to its left (arrow pointing at the frame).
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-headline">
      <div className={styles.content}>
        <p className={`body-1 ${styles.eyebrow}`}>Hello, I'm a</p>

        <h1 id="hero-headline" className={styles.headline}>
          <span className={styles.headlineLine}>
            <Highlight>Human-first</Highlight>
          </span>
          <span className={styles.headlineLine}>Product Designer</span>
        </h1>

        <p className={`body-1 ${styles.subtext}`}>
          who loves turning complex ideas and business challenges into simple, thoughtful experiences. I work across AI, product strategy, and human-centered design, while making sure accessibility is never an afterthought.
        </p>

        <div className={styles.action}>
          <Button
            onClick={() =>
              document
                .getElementById('contact')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            icon={
              <img
                src="/button-star.svg"
                alt=""
                width={26}
                height={24}
                className={styles.buttonIcon}
              />
            }
          >
            Reach out to me
          </Button>
        </div>
      </div>

      <div className={styles.media}>
        <div className={styles.hoverLabel}>
          <HoverLabel />
        </div>
        <div className={styles.mediaFrame}>
          <PhotoFrame
            src="/hero-photo.png"
            alt="Portrait of Ranya Vaid"
            hoverContent={
              <video
                src="/hero.mp4"
                muted
                loop
                playsInline
                preload="auto"
                poster="/hero-photo.png"
                aria-hidden="true"
              />
            }
          />
        </div>
      </div>
    </section>
  )
}
