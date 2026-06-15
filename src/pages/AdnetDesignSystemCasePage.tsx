import { useEffect, useRef, useState } from 'react'
import { Container } from '../components/layout/Container'
import { ScrollGifCanvas } from './ProcessGifCanvas'
import styles from './AdnetDesignSystemCasePage.module.css'

const IMPACT_CARDS = [
  {
    eyebrow: 'For The Product',
    metric: '100%',
    body: 'Reduction in visual inconsistencies across the platform post-launch.',
    color: '#FFCCF1',
  },
  {
    eyebrow: 'For The Users',
    metric: '30%',
    body: 'Faster task completion due to clearer visual hierarchy & consistent component behaviour.',
    color: '#fff3b0',
  },
  {
    eyebrow: 'For The Designers',
    metric: '3h',
    body: 'Saved per screen for designers. No rebuilding components.',
    color: '#fff3b0',
  },
  {
    eyebrow: 'For The Developers',
    metric: '50%',
    body: 'Fewer design-to-dev clarification rounds per feature cycle.',
    color: '#b8e6ff',
  },
] as const

export function AdnetDesignSystemCasePage() {
  const processFigureRef = useRef<HTMLDivElement | null>(null)
  const [processStarted, setProcessStarted] = useState(false)
  const stateLayerFigureRef = useRef<HTMLDivElement | null>(null)
  const [stateLayerStarted, setStateLayerStarted] = useState(false)
  const foundationsFigureRef = useRef<HTMLDivElement | null>(null)
  const [foundationsStarted, setFoundationsStarted] = useState(false)

  useEffect(() => {
    const target = processFigureRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting || processStarted) return

        target.classList.add(styles.processVisible)
        setProcessStarted(true)
        observer.unobserve(target)
      },
      { threshold: 0.25 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [processStarted])

  useEffect(() => {
    const section = stateLayerFigureRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting || stateLayerStarted) return

        setStateLayerStarted(true)
        observer.unobserve(section)
      },
      { threshold: 0.55 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [stateLayerStarted])

  useEffect(() => {
    const section = foundationsFigureRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting || foundationsStarted) return

        setFoundationsStarted(true)
        observer.unobserve(section)
      },
      { threshold: 0.25 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [foundationsStarted])

  return (
    <main className={styles.casePage}>
      <Container>
        <header className={styles.textContainer}>
          <span className={`body-3 ${styles.tag}`}>Design System</span>
          <h2 className={styles.heading}>
            Reducing Design &amp; Development Friction Through Adnet&apos;s
            Design System
          </h2>
          <p className={`body-1 ${styles.body}`}>
            A foundation-first approach to bringing consistency, speed, and
            shared language to a dev-first immigration advertising platform -
            without disrupting 2,000+ existing users.
          </p>
        </header>
      </Container>

      <section className={styles.imageScrollArea} aria-label="Case study visual">
        <div className={styles.imageStickyFrame}>
          <img
            src="/Adnet/cover.svg"
            alt="Adnet design system case study visual"
            className={styles.caseImage}
            draggable={false}
          />
        </div>
      </section>

      <Container>
        <section className={styles.textOnlySection} aria-label="Case study details">
            <div className={styles.textOnlyInner}>
              <div className={styles.mainColumn}>
                <section id="overview" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Overview</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      When I joined Adnet, the platform already existed. It was
                      a developer-first product built by engineers without a
                      formal design process. This meant components were
                      inconsistent, spacing was arbitrary, and visual logic
                      varied across screens.
                    </p>
                    <p className={`body-2 ${styles.mainBody}`}>
                      The lack of a shared design language affected both
                      usability and scalability. Teams were solving similar
                      problems repeatedly without a common foundation for
                      creating consistent, predictable experiences.
                    </p>
                  </div>
                  <div className={styles.overviewCards}>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Role</p>
                      <p className={`body-2 ${styles.cardText}`}>End-to-end UX</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Team</p>
                      <p className={`body-2 ${styles.cardText}`}>1 Product Manager, 2 Developers, 1 QA</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Duration</p>
                      <p className={`body-2 ${styles.cardText}`}>1 month</p>
                    </article>
                  </div>
                </section>

                <section id="discovery" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Discovery</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Before designing a single component, I conducted a
                      thorough audit of the existing platform. I catalogued
                      every UI element across every screen such as buttons,
                      inputs, modals, tables, typography, spacing, and color
                      usage. I identified where the same element appeared in
                      five different forms and where inconsistency was causing
                      real user confusion.
                    </p>
                    <p className={`body-2 ${styles.mainBody}`}>
                      The audit helped with two things-
                    </p>
                    <ol className={styles.discoveryList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Dissecting the problem areas to understand what we
                        already have
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Deciding on what to build
                      </li>
                    </ol>
                  </div>
                </section>

                <section id="trade-offs" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Revamp vs. design system</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      The obvious option was a full product redesign. New
                      flows, new visual language, ground-up. But one question
                      stopped us:{' '}
                      <span className={styles.inlineEmphasis}>
                        what happens to the users already on the platform?
                      </span>
                    </p>
                    <div className={styles.tradeOffCallout}>
                      <p className={`body-2 ${styles.mainBody}`}>
                        Changing everything at once would have meant asking
                        2,000+ users to relearn a complex product. This could
                        lead to potential abandonment of the platform and
                        business loss. The goal, then, became to balance the old
                        and new design language without sacrificing user
                        familiarity.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="process" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Process</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      I mapped out the process and made sure daily sync
                      remained a non-negotiable. It was essential to include
                      the developers from day one since this was a shared
                      system.
                    </p>
                  </div>
                  <div ref={processFigureRef} className={styles.processFigure}>
                    <ScrollGifCanvas
                      src="/Adnet/Process.gif"
                      shouldPlay={processStarted}
                      loop
                      ariaLabel="Adnet design system process flow animation"
                      className={styles.processImage}
                    />
                  </div>
                </section>

                <section id="strategizing-planning" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Strategizing &amp; Planning</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      To track what I was going to build and set up team
                      expectations, I built a notion page to organize a clear
                      inventory. This ensured:
                    </p>
                    <ol className={styles.discoveryList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                        The design system was not built in isolation but rather
                        as a collaboration between design and development
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Product Manager and stakeholders could map the progress
                        and provide feedback
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Iterations could be both tracked and made faster as
                        everyone remained informed.
                      </li>
                    </ol>
                  </div>
                  <div className={styles.trackerFigure}>
                    <img
                      src="/Adnet/tracker.jpg"
                      alt="Adnet design system tracker board"
                      className={styles.trackerImage}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="token-architecture" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Token Architecture</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Building the token foundation took the longest. I iterated
                      back and forth as there were two paths:
                    </p>
                  </div>

                  <div className={styles.tokenCards}>
                    <article className={styles.tokenCard}>
                      <img
                        src="/Adnet/token-1.svg"
                        alt="Component token examples"
                        className={styles.tokenCardImage}
                        draggable={false}
                      />
                      <p className={`body-3 ${styles.tokenCardTitle}`}>
                        Component-based tokens meant
                      </p>
                      <ul className={styles.tokenPoints}>
                        <li className={styles.tokenPoint}>
                          <img
                            src="/Adnet/check_circle.svg"
                            alt=""
                            aria-hidden="true"
                            className={styles.pointIcon}
                            draggable={false}
                          />
                          <span className={`body-3 ${styles.pointText}`}>
                            precise control for every component
                          </span>
                        </li>
                        <li className={styles.tokenPoint}>
                          <img
                            src="/Adnet/cross_circle.svg"
                            alt=""
                            aria-hidden="true"
                            className={styles.pointIcon}
                            draggable={false}
                          />
                          <span className={`body-3 ${styles.pointText}`}>
                            hundreds of tokens that designers and devs would
                            lose track of quickly
                          </span>
                        </li>
                      </ul>
                    </article>

                    <article className={styles.tokenCard}>
                      <img
                        src="/Adnet/token-2.svg"
                        alt="Semantic token examples"
                        className={styles.tokenCardImage}
                        draggable={false}
                      />
                      <p className={`body-3 ${styles.tokenCardTitle}`}>
                        Semantic tokens meant
                      </p>
                      <ul className={styles.tokenPoints}>
                        <li className={styles.tokenPoint}>
                          <img
                            src="/Adnet/check_circle.svg"
                            alt=""
                            aria-hidden="true"
                            className={styles.pointIcon}
                            draggable={false}
                          />
                          <span className={`body-3 ${styles.pointText}`}>
                            leaner and more reusable
                          </span>
                        </li>
                        <li className={styles.tokenPoint}>
                          <img
                            src="/Adnet/cross_circle.svg"
                            alt=""
                            aria-hidden="true"
                            className={styles.pointIcon}
                            draggable={false}
                          />
                          <span className={`body-3 ${styles.pointText}`}>
                            can become too generic or numerous as the brand
                            vocabulary grew
                          </span>
                        </li>
                      </ul>
                    </article>
                  </div>

                  <div className={`${styles.bodyStack} ${styles.contentGap32}`}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Instead of unique tokens per component, I went for semantic
                      tokens with standardized state behavior across the system
                      using two layers:
                    </p>
                  </div>

                  <div ref={stateLayerFigureRef} className={styles.stateLayerFigure}>
                    <ScrollGifCanvas
                      src="/Adnet/state-layer.gif"
                      shouldPlay={stateLayerStarted}
                      ariaLabel="State layer mapping: token tag, arrow, and usage text"
                      className={styles.stateLayerImage}
                    />
                  </div>

                  <div
                    className={`${styles.tradeOffCallout} ${styles.tradeOffCalloutGap32}`}
                  >
                    <p className={`body-2 ${styles.mainBody}`}>
                      Standardized state layers meant we never had to debate
                      &quot;what&apos;s the hover color for this component vs.
                      that component.&quot; The answer was always the same. The
                      system stayed lean without losing scalability.
                    </p>
                  </div>

                  <div
                    className={`${styles.bodyStack} ${styles.contentGap32Bridge}`}
                  >
                    <p className={`body-2 ${styles.mainBody}`}>
                      The token architecture then became:
                    </p>
                  </div>

                  <div className={styles.tokenArchitectureFigure}>
                    <img
                      src="/Adnet/token-structure.svg"
                      alt="Token architecture flow from primitive tokens to semantic tokens and state layers"
                      className={styles.tokenArchitectureImage}
                      draggable={false}
                    />
                  </div>

                  <div
                    className={`${styles.bodyStack} ${styles.contentGap32Bridge}`}
                  >
                    <p className={`body-2 ${styles.mainBody}`}>
                      The final foundation for the components looked something
                      like this:
                    </p>
                  </div>

                  <div ref={foundationsFigureRef} className={styles.foundationsFigure}>
                    <ScrollGifCanvas
                      src="/Adnet/foundations.gif"
                      shouldPlay={foundationsStarted}
                      loop
                      ariaLabel="Foundations animation"
                      className={styles.foundationsImage}
                    />
                  </div>
                </section>

                <section id="components" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Components</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Post building the foundation tokens, I built the
                      components with three primary factors in mind:
                    </p>
                    <ol className={styles.discoveryList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Responsiveness and adaptiveness across different use
                        cases
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Reduced need to detach instance or component overrides
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Clear and consistent naming convention for designers to
                        scale and developers to build.
                      </li>
                    </ol>
                  </div>

                  <div className={styles.componentsFigure}>
                    <img
                      src="/Adnet/components.gif"
                      alt="Components animation"
                      className={styles.componentsImage}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="handoff" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Handoff</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Handoff was one of the most crucial part of the design
                      system. If this wasn&apos;t done well, the system might
                      break. So, here is how I did it:
                    </p>
                    <ol className={styles.discoveryList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Components in Figma mirrored how they&apos;d be built in
                        code
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Naming conventions were shared &amp; consistent
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Component was annotated with states, edge cases, and
                        usage notes.
                      </li>
                    </ol>
                  </div>

                  <div className={styles.handoffFigure}>
                    <img
                      src="/Adnet/handoff.png"
                      alt="Badge component documentation showing anatomy, states, and usage notes"
                      className={styles.handoffImage}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="impact" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>
                    What the design system changed
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Here is what the new design system was able to achieve:
                    </p>
                  </div>

                  <div className={styles.impactCards}>
                    {IMPACT_CARDS.map((card) => (
                      <article
                        key={card.eyebrow}
                        className={styles.impactCard}
                        style={{ backgroundColor: card.color }}
                      >
                        <p className={`body-3 ${styles.impactCardEyebrow}`}>
                          {card.eyebrow}
                        </p>
                        <p className={`h2 ${styles.impactCardMetric}`}>
                          {card.metric}
                        </p>
                        <p className={`body-2 ${styles.impactCardBody}`}>
                          {card.body}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="learnings" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>What I learnt</h3>
                  <div className={styles.bodyStack}>
                    <ul className={styles.learningsList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                        A great system is invisible; it only shows up when
                        something is inconsistent.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Foundations may take a lot of time and effort but it is
                        the cheapest place to get things wrong.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Involving developers from day one is the difference
                        between a system that breaks and a system that
                        doesn&apos;t.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                        Lastly, much like any other design process, building a
                        design system is a constantly evolving process.
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
        </section>
      </Container>
    </main>
  )
}
