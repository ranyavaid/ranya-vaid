import { useState } from 'react'
import styles from './DesignQuestsSection.module.css'

type QuestTab = {
  id: string
  label: string
}

type QuestCard = {
  id: string
  image: string
  imageAlt: string
  title: string
  href?: string
}

const QUEST_TABS: QuestTab[] = [
  { id: 'ai-experiments', label: 'AI Experiments' },
  { id: 'interaction-design', label: 'Interaction Design' },
]

const AI_EXPERIMENT_CARDS: QuestCard[] = [
  {
    id: 'stitchuations',
    image: '/stitchuations.png',
    imageAlt: 'Stitchuations project preview',
    title: 'Stitchuations: A Creative Playground for Crochet, Knitting, and Sewing Inspiration',
    href: 'https://stitchuations.vercel.app/',
  },
  {
    id: 'yoga-reset',
    image: '/yoga-reset.png',
    imageAlt: 'Yoga Reset project preview',
    title: 'Yoga Reset: A Mindful Reset Experience for Busy Workdays',
    href: 'https://yoga-reset.vercel.app/',
  },
]

const INTERACTION_DESIGN_CARDS: QuestCard[] = [
  {
    id: 'collectibles',
    image: '/interaction-design/collectibles.gif',
    imageAlt: 'Interaction design collectibles gif',
    title: '',
  },
  {
    id: 'share',
    image: '/interaction-design/share.gif',
    imageAlt: 'Interaction design share gif',
    title: '',
  },
  {
    id: 'intro',
    image: '/interaction-design/intro.gif?v=2',
    imageAlt: 'Interaction design intro gif',
    title: '',
  },
  {
    id: 'notes',
    image: '/interaction-design/notes.gif',
    imageAlt: 'Interaction design notes gif',
    title: '',
  },
]

/**
 * DesignQuestsSection
 * A featured playground section with tab-style filters and browser-like cards.
 */
export function DesignQuestsSection() {
  const [selectedTab, setSelectedTab] = useState(QUEST_TABS[0].id)

  return (
    <section
      id="playground"
      className={styles.section}
      aria-labelledby="design-quests-heading"
    >
      <header className={styles.header}>
        <h2 id="design-quests-heading" className={styles.heading}>
          Design Quests
        </h2>
        <div className={styles.tabRail} role="tablist" aria-label="Quest categories">
          {QUEST_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab.id ? 'true' : 'false'}
              className={`${styles.tab} button-text ${selectedTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <label className={styles.mobileTabLabel} htmlFor="quest-category">
          Category
        </label>
        <select
          id="quest-category"
          className={`${styles.mobileTabSelect} button-text`}
          value={selectedTab}
          onChange={(event) => setSelectedTab(event.target.value)}
          aria-label="Quest categories"
        >
          {QUEST_TABS.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </header>

      {selectedTab === 'interaction-design' ? (
        <div className={styles.interactionGrid}>
          {INTERACTION_DESIGN_CARDS.map((card) => (
            <div
              key={card.id}
              className={`${styles.interactionCell} ${
                card.id === 'notes'
                  ? styles.gifNotes
                  : card.id === 'intro'
                    ? styles.gifIntro
                    : card.id === 'collectibles'
                      ? styles.gifCollectibles
                      : styles.gifShare
              }`}
            >
              <img src={card.image} alt={card.imageAlt} className={styles.interactionGif} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cards}>
          {AI_EXPERIMENT_CARDS.map((card) => (
            <article key={card.id} className={styles.card}>
              <div className={styles.cardChrome} aria-hidden="true">
                <span className={styles.chromeDotRed} />
                <span className={styles.chromeDotGray} />
                <span className={styles.chromeDotGreen} />
              </div>

              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className={styles.cardLink}
              >
                <img src={card.image} alt={card.imageAlt} className={styles.cardImage} />
              </a>

              <h3 className={styles.cardTitle}>{card.title}</h3>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
