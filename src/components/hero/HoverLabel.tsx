import styles from './HoverLabel.module.css'

/**
 * HoverLabel
 * The "Try Hovering!" callout — handwritten label tilted 8.73° with a
 * curly arrow pointing down toward the PhotoFrame. Decorative; positioned
 * absolutely over the right column of the hero so it doesn't affect flow.
 */
export function HoverLabel() {
  return (
    <div className={styles.label} aria-hidden="true">
      <span className={`handwritten ${styles.text} ${styles.desktopText}`}>
        Try Hovering!
      </span>
      <span className={`handwritten ${styles.text} ${styles.mobileText}`}>
        Try tapping
      </span>
      <img src="/arrow-curly.svg" alt="" className={styles.arrow} />
    </div>
  )
}
