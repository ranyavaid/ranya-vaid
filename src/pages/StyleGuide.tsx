import { Container } from '../components/layout/Container'
import styles from './StyleGuide.module.css'

type ColorSwatch = {
  name: string
  token: string
  hex: string
  /** When true, draw a border around the swatch so light colors stay visible */
  bordered?: boolean
  /** When true, sample text on the swatch is rendered in white */
  darkText?: boolean
}

const COLORS: ColorSwatch[] = [
  {
    name: 'Black Primary',
    token: '--color-black-primary',
    hex: '#1A1A1A',
    darkText: true,
  },
  {
    name: 'Black Secondary',
    token: '--color-black-secondary',
    hex: '#555555',
    darkText: true,
  },
  {
    name: 'White Primary',
    token: '--color-white-primary',
    hex: '#FFFFFF',
    bordered: true,
  },
  {
    name: 'White Secondary',
    token: '--color-white-secondary',
    hex: '#F2F2F2',
    bordered: true,
  },
  { name: 'Stroke', token: '--color-stroke', hex: '#DFDFDF', bordered: true },
  { name: 'Blue', token: '--color-blue', hex: '#0054F3', darkText: true },
]

type TypeSpec = {
  label: string
  className: string
  spec: string
  sample: string
}

const TYPE_SPECS: TypeSpec[] = [
  {
    label: 'Heading 1',
    className: 'h1',
    spec: 'Geist Mono Medium · 64 / 74 · +1%',
    sample: 'The quick brown fox',
  },
  {
    label: 'Heading 2',
    className: 'h2',
    spec: 'Geist Mono Medium · 54 / 64 · +1%',
    sample: 'The quick brown fox',
  },
  {
    label: 'Heading 3',
    className: 'h3',
    spec: 'Geist Mono Regular · 24 / 32 · +1%',
    sample: 'The quick brown fox jumps over the lazy dog',
  },
  {
    label: 'Heading 4',
    className: 'h4',
    spec: 'Geist Mono Regular · 20 / 30 · +1%',
    sample: 'The quick brown fox jumps over the lazy dog',
  },
  {
    label: 'Body 1',
    className: 'body-1',
    spec: 'Instrument Sans Regular · 18 / 24',
    sample:
      'Body text is set in Instrument Sans. Used for paragraphs, longer descriptions, and any reading-heavy content.',
  },
  {
    label: 'Body 2',
    className: 'body-2',
    spec: 'Instrument Sans Regular · 16 / 22',
    sample:
      'A slightly smaller body size for secondary content, captions, and supporting copy beside larger elements.',
  },
  {
    label: 'Body 3',
    className: 'body-3',
    spec: 'Instrument Sans Regular · 14 / 22',
    sample:
      'The smallest body size, used sparingly for labels, metadata, and fine print.',
  },
  {
    label: 'Button',
    className: 'button-text',
    spec: 'Geist Mono Medium · 18 / 24',
    sample: 'Get in touch',
  },
  {
    label: 'Handwritten',
    className: 'handwritten',
    spec: 'Caveat Bold · 26 / 32',
    sample: 'a little handwritten note',
  },
]

export function StyleGuide() {
  return (
    <main className={styles.page}>
      <Container>
        <header className={styles.header}>
          <p className={`body-3 ${styles.eyebrow}`}>01 — Foundations</p>
          <h1>Style Guide</h1>
          <p className={`body-1 ${styles.subhead}`}>
            The foundational tokens that everything on this site is built from.
            Colors, type, and layout — defined once and reused everywhere.
          </p>
        </header>

        <section className={styles.section} aria-labelledby="colors-heading">
          <div className={styles.sectionHead}>
            <h2 id="colors-heading">Colors</h2>
            <p className={`body-2 ${styles.sectionDescription}`}>
              Six core colors. Use semantic tokens in components so the palette
              can be re-themed without touching every file.
            </p>
          </div>

          <div className={styles.colorGrid}>
            {COLORS.map((c) => (
              <article
                key={c.token}
                className={[
                  styles.swatchCard,
                  c.bordered ? styles.swatchCardBordered : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div
                  className={styles.swatchSurface}
                  style={{ background: `var(${c.token})` }}
                >
                  <span
                    className={`body-3 ${styles.swatchHexOnSurface} ${
                      c.darkText ? styles.swatchHexLight : ''
                    }`}
                  >
                    {c.hex}
                  </span>
                </div>
                <div className={styles.swatchMeta}>
                  <p className="body-2">
                    <strong>{c.name}</strong>
                  </p>
                  <p className={`body-3 ${styles.tokenName}`}>{c.token}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="type-heading">
          <div className={styles.sectionHead}>
            <h2 id="type-heading">Typography</h2>
            <p className={`body-2 ${styles.sectionDescription}`}>
              Geist Mono for headings and buttons. Instrument Sans for body
              copy.
            </p>
          </div>

          <div className={styles.typeList}>
            {TYPE_SPECS.map((t) => (
              <article key={t.label} className={styles.typeRow}>
                <div className={styles.typeMeta}>
                  <p className="body-2">
                    <strong>{t.label}</strong>
                  </p>
                  <p className={`body-3 ${styles.tokenName}`}>{t.spec}</p>
                </div>
                <div className={t.className}>{t.sample}</div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="layout-heading">
          <div className={styles.sectionHead}>
            <h2 id="layout-heading">Layout</h2>
            <p className={`body-2 ${styles.sectionDescription}`}>
              Max page width is 1440px. On a 1440px screen, the side gutters
              are 100px each — leaving 1240px of content. Gutters scale
              fluidly down to 20px on small screens.
            </p>
          </div>

          <div className={styles.layoutDemo}>
            <div className={styles.layoutGutter} aria-hidden="true">
              <span className={`body-3 ${styles.gutterLabel}`}>gutter</span>
            </div>
            <div className={styles.layoutContent}>
              <p className="body-2">Content area (1240px @ 1440px screen)</p>
            </div>
            <div className={styles.layoutGutter} aria-hidden="true">
              <span className={`body-3 ${styles.gutterLabel}`}>gutter</span>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
