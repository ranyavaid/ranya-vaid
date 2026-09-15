import { publicUrl } from '../../utils/publicUrl'
import styles from './StackSection.module.css'

type StackItem = {
  id: string
  src: string
  alt: string
  label: string
}

const STACK_ITEMS: StackItem[] = [
  {
    id: 'figma',
    src: publicUrl('/Stack/Figma.png'),
    alt: 'Figma',
    label: 'Design & Collaboration',
  },
  {
    id: 'miro',
    src: publicUrl('/Stack/Miro.png'),
    alt: 'Miro',
    label: 'Brainstorming & Ideating',
  },
  {
    id: 'xd',
    src: publicUrl('/Stack/XD.png'),
    alt: 'Adobe XD',
    label: 'Design',
  },
  {
    id: 'loveable',
    src: publicUrl('/Stack/loveable.png'),
    alt: 'Loveable',
    label: 'Concept Testing',
  },
  {
    id: 'notion',
    src: publicUrl('/Stack/notion.png'),
    alt: 'Notion',
    label: 'Documentation & Planning',
  },
  {
    id: 'cursor',
    src: publicUrl('/Stack/Cursor.png'),
    alt: 'Cursor',
    label: 'Development',
  },
  {
    id: 'git',
    src: publicUrl('/Stack/git.png'),
    alt: 'GitHub',
    label: 'Version Control',
  },
]

/**
 * StackSection
 * Tech stack showcase with elevated logos.
 * On hover each logo lifts and shows a handwritten blue note.
 */
export function StackSection() {
  return (
    <section className={styles.section} aria-labelledby="stack-heading">
      <header className={styles.header}>
        <h2 id="stack-heading" className={styles.heading}>
          My Stack
        </h2>
        <p className={`body-1 ${styles.subtext}`}>
          Tools are just a means to an end, they don’t dictate how I work. But, these are some of the tools that have become part of my
          process.
        </p>
      </header>

      <ul className={styles.logos} aria-label="Design and build tools">
        {STACK_ITEMS.map((item) => (
          <li key={item.id} className={styles.logoItem}>
            <img
              src={item.src}
              alt={item.alt}
              className={styles.logo}
              draggable={false}
            />
            <span className={`handwritten ${styles.hoverText}`}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
