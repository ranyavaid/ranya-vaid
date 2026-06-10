import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { WorkCase } from './worksData'
import styles from './Notebook.module.css'

type NotebookProps = WorkCase

/**
 * Notebook
 * A spiral-bound folder card — colored back, project image, front pocket
 * with tag + title. On hover the inner contents lift slightly.
 */
export function Notebook({
  href,
  backColor,
  frontColor,
  frontShadow,
  imageLayers,
  tag,
  title,
}: NotebookProps) {
  const isExternalLink = /^https?:\/\//.test(href)
  const notebookStyle = {
    '--notebook-back': backColor,
    '--notebook-front': frontColor,
    '--notebook-front-shadow': frontShadow,
  } as CSSProperties
  const notebookContent = (
    <>
      <div className={styles.back} aria-hidden="true" />

      <div className={styles.movableImage}>
        <div className={styles.imageWrap}>
          {imageLayers.map((layer, index) => (
            <img
              key={layer.src}
              src={layer.src}
              alt={index === 0 ? layer.alt ?? '' : ''}
              className={`${styles.imageLayer} ${styles[layer.className]}`}
              draggable={false}
            />
          ))}
        </div>
      </div>

      <img
        src="/notebook/notebook-spiral.svg"
        alt=""
        className={styles.spiral}
        draggable={false}
      />

      <div className={styles.front} aria-hidden="true" />

      <div className={styles.movableMeta}>
        <div className={styles.pocketMeta}>
          <span className={`body-3 ${styles.tag}`}>{tag}</span>
          <p className={`h3 ${styles.title}`}>{title}</p>
        </div>
      </div>
    </>
  )

  if (isExternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={title}
        className={styles.notebook}
        style={notebookStyle}
      >
        {notebookContent}
      </a>
    )
  }

  return (
    <Link
      to={href}
      aria-label={title}
      className={styles.notebook}
      style={notebookStyle}
    >
      {notebookContent}
    </Link>
  )
}
