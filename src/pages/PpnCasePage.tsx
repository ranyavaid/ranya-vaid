import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Container } from '../components/layout/Container'
import {
  CaseStudySectionNav,
  type CaseStudySection,
} from '../components/case-study/CaseStudySectionNav'
import {
  LightboxZoomableImage,
  type LightboxZoomState,
} from '../components/case-study/LightboxZoomableImage'
import { CaseStudyVideoPlayer } from '../components/case-study/CaseStudyVideoPlayer'
import { publicUrl } from '../utils/publicUrl'
import { protectedVideoProps } from '../utils/videoProtection'
import styles from './PpnCasePage.module.css'
import acceptBusinessVersion from 'virtual:public-asset-version/PPN/accept_business.mp4'
import assignRepVersion from 'virtual:public-asset-version/PPN/assign_rep.mp4'
import categoriesVersion from 'virtual:public-asset-version/PPN/categories.mp4'
import enrollSubscriptionVersion from 'virtual:public-asset-version/PPN/enroll_subscription.mp4'
import competitorsImageVersion from 'virtual:public-asset-version/PPN/competitors.png'
import personaImageVersion from 'virtual:public-asset-version/PPN/persona.png'
import userPersonaImageVersion from 'virtual:public-asset-version/PPN/user_persona.png'
import serviceImageVersion from 'virtual:public-asset-version/PPN/service.png'
import subs1ImageVersion from 'virtual:public-asset-version/PPN/subs_1.png'
import subs2ImageVersion from 'virtual:public-asset-version/PPN/subs_2.png'
import subs3ImageVersion from 'virtual:public-asset-version/PPN/subs_3.png'
import req1ImageVersion from 'virtual:public-asset-version/PPN/req_1.png'
import req2ImageVersion from 'virtual:public-asset-version/PPN/req_2.png'
import req3ImageVersion from 'virtual:public-asset-version/PPN/req_3.png'
import submitRequestVersion from 'virtual:public-asset-version/PPN/submit_request.mp4'
import architectureImageVersion from 'virtual:public-asset-version/PPN/AI.png'
import bannerVersion from 'virtual:public-asset-version/PPN/banner.mp4'

const RESEARCH_CLIENT_DELIVERABLES = [
  'Interview synthesis from 8 synthesized sessions',
  'A detailed PRD with feature requirements and business logic',
] as const

const RESEARCH_BUILT_OUTPUTS = [
  'Competitor analysis',
  'Proto-personas',
  'IA + system architecture',
  'Service design blueprint',
  'Business model mapping',
] as const

const PROBLEM_CARDS = [
  {
    eyebrow: 'Service Providers',
    title: 'Struggle with Discovery',
    body: 'Service Provider often struggle to get recognition among more established providers. Consequently, they lose out on chances to connect with potential customers.',
    backgroundColor: '#fff3b0',
    layout: 'half' as const,
  },
  {
    eyebrow: 'Service Seekers',
    title: 'Lack trust/ transparency',
    body: 'Without consistent pricing, reviews, or reliable information, seekers had to rely heavily on word of mouth or move conversations and transactions off-platform.',
    backgroundColor: '#ffccf1',
    layout: 'half' as const,
  },
  {
    eyebrow: 'Community',
    title: 'Lack infrastructure',
    body: 'No dedicated space to recognise good deeds or celebrate acts of kindness. This made it difficult for seekers and providers to build the kind of trust that goes beyond a single service interaction.',
    backgroundColor: '#d6f0ff',
    layout: 'wide' as const,
  },
] as const

const BUSINESS_MODEL_CARDS = [
  {
    eyebrow: 'Revenue',
    eyebrowBackground: '#D6F0FF',
    eyebrowColor: '#0054F3',
    title: 'Provider subscriptions',
    body: 'Businesses pay tiered subscriptions to list their services, with higher plans unlocking greater visibility, advanced features, and priority placement.',
  },
  {
    eyebrow: 'Social Impact',
    eyebrowBackground: '#FFCCF1',
    eyebrowColor: '#A8027A',
    title: 'Free participation for Non-profits',
    body: 'Non-profits can join the platform at no cost in exchange for contributing resources and services to the community. Public entities can also share relevant compliance and public health information.',
  },
] as const

const ACCEPT_BUSINESS_VIDEO_SRC = publicUrl(`/PPN/accept_business.mp4?v=${acceptBusinessVersion}`)
const ASSIGN_REP_VIDEO_SRC = publicUrl(`/PPN/assign_rep.mp4?v=${assignRepVersion}`)
const CATEGORIES_VIDEO_SRC = publicUrl(`/PPN/categories.mp4?v=${categoriesVersion}`)
const ENROLL_SUBSCRIPTION_VIDEO_SRC = publicUrl(`/PPN/enroll_subscription.mp4?v=${enrollSubscriptionVersion}`)
const SUBMIT_REQUEST_VIDEO_SRC = publicUrl(`/PPN/submit_request.mp4?v=${submitRequestVersion}`)
const BANNER_VIDEO_SRC = publicUrl(`/PPN/banner.mp4?v=${bannerVersion}`)

const PPN_SECTIONS: CaseStudySection[] = [
  { id: 'top', label: 'Top' },
  { id: 'overview', label: 'Overview' },
  { id: 'Research', label: 'Research' },
  { id: 'competitor-analysis', label: 'Competitor Benchmarking' },
  { id: 'Problem', label: 'Defining the Problem' },
  { id: 'personas', label: 'The 7-persona ecosystem' },
  { id: 'information-architecture', label: 'Structuring the platform architecture' },
  { id: 'service-design', label: 'Designing the service blueprint' },
  { id: 'business-model', label: 'Mapping the business model' },
  { id: 'iterations', label: 'The forms we almost shipped' },
  { id: 'finals', label: 'Final Screens' },
  { id: 'impact', label: 'Impact' },
  { id: 'learnings', label: 'What I learnt' },
]

type FinalScreenSegment = {
  src: string
  caption: string
  intro?: {
    heading: string
    body?: string
    decisionsLead?: string
    decisionItems?: string[]
  }
}

const FINAL_SCREEN_SEGMENTS: FinalScreenSegment[] = [
  {
    intro: {
      heading: 'Reviewing and responding to leads',
      body: 'Businesses use an inbox-style dashboard to view incoming requests and reply to seeker messages in one place.',
    },
    src: ACCEPT_BUSINESS_VIDEO_SRC,
    caption: 'A business views available leads and responds to their messages',
  },
  {
    intro: {
      heading: 'Assigning County Representatives',
      decisionsLead: 'There were two major decisions I made for this flow:',
      decisionItems: [
        'Backend flagged that even tabs would load all data and filter client-side, straining the server. I researched progressive disclosure and proposed tabbed views (All / Enabled / Disabled / Unassigned) + pagination at 10 rows per screen.',
        'A checkbox grid per heading felt redundant and hard to scan. So, I switched to an inline editor: "Edit" turns the row into dropdowns for permissions. This kept view/edit modes consistent, and the explicit edit-then-save pattern made high-level permission changes deliberate instead of accidental.',
      ],
    },
    src: ASSIGN_REP_VIDEO_SRC,
    caption: 'State representative assigns county representative',
  },
  {
    intro: {
      heading: 'Adding category & sub-category',
      decisionItems: [
        'The user must select a category first to edit its sub-category\'s pricing. The alternative was showing every sub-category with filters. I went with entering a category first, because it was more scalable even though it added a click.',
        'Instead of keeping inline editing like the permissions, I went with menu → edit → pop-up. The pricing table was like many other data-dense tables on the platform, so making this one fully editable would\'ve set an inconsistent pattern. The pop-up also gives a focused experience — since the screen is already dense, letting the user concentrate on one entry at a time.',
      ],
    },
    src: CATEGORIES_VIDEO_SRC,
    caption: 'Admin adds and edits categories/sub-categories',
  },
]

const COMPETITORS_IMAGE_SRC = publicUrl(`/PPN/competitors.png?v=${competitorsImageVersion}`)
const COMPETITORS_IMAGE_ALT =
  "Competitor's strengths, patterns to follow, and differentiators as sticky notes"

const USER_PERSONA_IMAGE_SRC = publicUrl(`/PPN/user_persona.png?v=${userPersonaImageVersion}`)
const USER_PERSONA_IMAGE_ALT =
  'Individual user persona profiles for each role in the platform ecosystem'
const PERSONA_IMAGE_SRC = publicUrl(`/PPN/persona.png?v=${personaImageVersion}`)
const PERSONA_IMAGE_ALT =
  'Seven-persona ecosystem map showing how all roles interact with the platform and each other'

type PersonaSlide = {
  src: string
  alt: string
  width: number
  height: number
}

/** Display frame ratio (1080×582); assets are exported at 1.5× (1620×873). */
const PERSONA_SLIDE_WIDTH = 1620
const PERSONA_SLIDE_HEIGHT = 873

const PERSONA_SLIDES: PersonaSlide[] = [
  {
    src: USER_PERSONA_IMAGE_SRC,
    alt: USER_PERSONA_IMAGE_ALT,
    width: PERSONA_SLIDE_WIDTH,
    height: PERSONA_SLIDE_HEIGHT,
  },
  {
    src: PERSONA_IMAGE_SRC,
    alt: PERSONA_IMAGE_ALT,
    width: PERSONA_SLIDE_WIDTH,
    height: PERSONA_SLIDE_HEIGHT,
  },
]
const SERVICE_IMAGE_SRC = publicUrl(`/PPN/service.png?v=${serviceImageVersion}`)
const SERVICE_IMAGE_ALT =
  'Service blueprint mapping user interactions, platform touchpoints, and supporting processes across the core service journey'
/** Exported at 2× (2160×1415) for crisp display at 1080px carousel width. */
const ITERATION_SLIDE_WIDTH = 2160
const ITERATION_SLIDE_HEIGHT = 1415

type Iteration1Slide = {
  src: string
  alt: string
}

const ITERATION1_SLIDES: Iteration1Slide[] = [
  {
    src: publicUrl(`/PPN/subs_1.png?v=${subs1ImageVersion}`),
    alt: 'Enroll subscription form step 1 showing provider business details',
  },
  {
    src: publicUrl(`/PPN/subs_2.png?v=${subs2ImageVersion}`),
    alt: 'Enroll subscription form step 2 showing subscription plan selection',
  },
  {
    src: publicUrl(`/PPN/subs_3.png?v=${subs3ImageVersion}`),
    alt: 'Enroll subscription form step 3 showing enrollment review and confirmation',
  },
]

const ITERATION2_SLIDES: Iteration1Slide[] = [
  {
    src: publicUrl(`/PPN/req_1.png?v=${req1ImageVersion}`),
    alt: 'Submit request form step 1 showing service category and request details',
  },
  {
    src: publicUrl(`/PPN/req_2.png?v=${req2ImageVersion}`),
    alt: 'Submit request form step 2 showing provider preferences and scheduling',
  },
  {
    src: publicUrl(`/PPN/req_3.png?v=${req3ImageVersion}`),
    alt: 'Submit request form step 3 showing request review and submission',
  },
]
const ARCHITECTURE_IMAGE_SRC = publicUrl(`/PPN/AI.png?v=${architectureImageVersion}`)
const ARCHITECTURE_IMAGE_ALT =
  'Platform information architecture organized by user roles, features, and workflows'

type ZoomedImage = {
  src: string
  alt: string
}

type ResearchImageLightboxProps = {
  image: ZoomedImage
  onClose: () => void
}

function ResearchImageLightbox({ image, onClose }: ResearchImageLightboxProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragOriginRef = useRef({ pointerX: 0, pointerY: 0, panX: 0, panY: 0 })
  const suppressClickRef = useRef(false)

  useEffect(() => {
    setIsExpanded(false)
    setPan({ x: 0, y: 0 })
    setIsDragging(false)
    suppressClickRef.current = false
  }, [image.src])

  const clampPan = useCallback((nextPan: { x: number; y: number }) => {
    const stage = stageRef.current
    const imageElement = imageRef.current
    if (!stage || !imageElement) return nextPan

    const maxX = Math.max(0, (imageElement.offsetWidth - stage.clientWidth) / 2)
    const maxY = Math.max(0, (imageElement.offsetHeight - stage.clientHeight) / 2)

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    }
  }, [])

  const zoomIn = useCallback(() => {
    setIsExpanded(true)
    setPan({ x: 0, y: 0 })
  }, [])

  const zoomOut = useCallback(() => {
    setIsExpanded(false)
    setPan({ x: 0, y: 0 })
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      if (isExpanded) {
        event.preventDefault()
        zoomOut()
        return
      }

      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, onClose, zoomOut])

  const handleStageClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (suppressClickRef.current) {
        suppressClickRef.current = false
        return
      }

      if (isExpanded) {
        zoomOut()
        return
      }

      zoomIn()
    },
    [isExpanded, zoomIn, zoomOut]
  )

  const handleStageDoubleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      if (!isExpanded) return
      zoomOut()
    },
    [isExpanded, zoomOut]
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isExpanded) return

      suppressClickRef.current = false
      event.preventDefault()
      setIsDragging(true)
      dragOriginRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        panX: pan.x,
        panY: pan.y,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [isExpanded, pan.x, pan.y]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return

      const deltaX = event.clientX - dragOriginRef.current.pointerX
      const deltaY = event.clientY - dragOriginRef.current.pointerY

      if (Math.hypot(deltaX, deltaY) > 5) {
        suppressClickRef.current = true
      }

      setPan(
        clampPan({
          x: dragOriginRef.current.panX + deltaX,
          y: dragOriginRef.current.panY + deltaY,
        })
      )
    },
    [clampPan, isDragging]
  )

  const stopDragging = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
  }, [])

  const handleImageLoad = useCallback(() => {
    if (!isExpanded) return
    setPan((previous) => clampPan(previous))
  }, [clampPan, isExpanded])

  return (
    <div
      className={styles.researchLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Image full screen view"
      onClick={onClose}
    >
      <button
        type="button"
        className={styles.researchLightboxClose}
        aria-label="Close full screen view"
        onClick={onClose}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        ref={stageRef}
        className={`${styles.researchLightboxStage} ${
          isExpanded ? styles.researchLightboxStageExpanded : styles.researchLightboxStageFit
        } ${isDragging ? styles.researchLightboxStageDragging : ''}`}
        onClick={handleStageClick}
        onDoubleClick={handleStageDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <img
          ref={imageRef}
          src={image.src}
          alt={image.alt}
          className={`${styles.researchLightboxImage} ${
            isExpanded ? styles.researchLightboxImageExpanded : ''
          }`}
          style={
            isExpanded
              ? ({
                  '--lightbox-pan-x': `${pan.x}px`,
                  '--lightbox-pan-y': `${pan.y}px`,
                } as CSSProperties)
              : undefined
          }
          draggable={false}
          onLoad={handleImageLoad}
        />
        {!isExpanded ? (
          <FigureZoomButton
            variant="magnify"
            label="Zoom in further on image"
            onClick={zoomIn}
          />
        ) : null}
      </div>
    </div>
  )
}

function FigureZoomButton({
  label,
  onClick,
  variant = 'expand',
}: {
  label: string
  onClick: () => void
  variant?: 'expand' | 'magnify' | 'magnifyOut'
}) {
  return (
    <button
      type="button"
      className={styles.figureZoomButton}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      {variant === 'magnify' || variant === 'magnifyOut' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.75" cy="6.75" r="4.25" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M10 10L13.25 13.25"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {variant === 'magnifyOut' ? (
            <path d="M5 6.75H8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          ) : (
            <>
              <path d="M5 6.75H8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              <path d="M6.75 5V8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </>
          )}
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6.5 2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V6.5M9.5 2.5H12.5C13.0523 2.5 13.5 2.94772 13.5 3.5V6.5M9.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V9.5M6.5 13.5H3.5C2.94772 13.5 2.5 13.0523 2.5 12.5V9.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

type CaseCarouselControlsProps = {
  slideCount: number
  activeIndex: number
  progressKey: number
  ariaLabel: string
  advanceDurationMs: number
  showProgressLoader?: boolean
  onGoTo: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

function CaseCarouselControls({
  slideCount,
  activeIndex,
  progressKey,
  ariaLabel,
  advanceDurationMs,
  showProgressLoader = true,
  onGoTo,
  onPrevious,
  onNext,
}: CaseCarouselControlsProps) {
  return (
    <div
      className={styles.caseCarouselControls}
      style={
        {
          '--carousel-advance-duration': `${advanceDurationMs}ms`,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className={styles.caseCarouselArrow}
        aria-label="Previous slide"
        disabled={slideCount <= 1}
        onClick={(event) => {
          onPrevious()
          event.currentTarget.blur()
        }}
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path
            d="M7 1L1 7L7 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.caseCarouselDots} role="tablist" aria-label={ariaLabel}>
        {Array.from({ length: slideCount }, (_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={activeIndex === index}
            className={`${styles.caseCarouselDot} ${
              activeIndex === index ? styles.caseCarouselDotActive : ''
            }`}
            onClick={(event) => {
              onGoTo(index)
              event.currentTarget.blur()
            }}
          >
            {activeIndex === index ? (
              showProgressLoader ? (
                <span className={styles.caseCarouselDotLoader}>
                  <span key={progressKey} className={styles.caseCarouselDotLoaderFill} />
                </span>
              ) : (
                <span
                  className={`${styles.caseCarouselDotMark} ${styles.caseCarouselDotMarkActive}`}
                />
              )
            ) : (
              <span className={styles.caseCarouselDotMark} />
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.caseCarouselArrow}
        aria-label="Next slide"
        disabled={slideCount <= 1}
        onClick={(event) => {
          onNext()
          event.currentTarget.blur()
        }}
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path
            d="M1 1L7 7L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

type LoopSlideEntry<T> = {
  item: T
  key: string
  isClone: boolean
  logicalIndex: number | null
}

function getLoopSlideEntries<T>(items: readonly T[]): LoopSlideEntry<T>[] {
  if (items.length <= 1) {
    return items.map((item, index) => ({
      item,
      key: `slide-${index}`,
      isClone: false,
      logicalIndex: index,
    }))
  }

  return [
    {
      item: items[items.length - 1],
      key: 'loop-clone-start',
      isClone: true,
      logicalIndex: items.length - 1,
    },
    ...items.map((item, index) => ({
      item,
      key: `slide-${index}`,
      isClone: false,
      logicalIndex: index,
    })),
    {
      item: items[0],
      key: 'loop-clone-end',
      isClone: true,
      logicalIndex: 0,
    },
  ]
}

function domToLogicalIndex(domIndex: number, slideCount: number) {
  if (slideCount <= 1) return domIndex
  if (domIndex === 0) return slideCount - 1
  if (domIndex === slideCount + 1) return 0
  return domIndex - 1
}

function logicalToDomIndex(logicalIndex: number, slideCount: number) {
  if (slideCount <= 1) return logicalIndex
  return logicalIndex + 1
}

const CAROUSEL_GAP_PX = 24

function useCaseCarousel(
  slideCount: number,
  autoAdvanceMs: number,
  options?: { autoAdvance?: boolean; isInView?: boolean; slideWidthUnit?: number }
) {
  const autoAdvance = options?.autoAdvance ?? true
  const isInView = options?.isInView ?? false
  const slideWidthUnit = options?.slideWidthUnit
  const loopEnabled = slideCount > 1
  const trackRef = useRef<HTMLDivElement | null>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const isRepositioningRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressKey, setProgressKey] = useState(0)

  const registerSlideRef = useCallback((domIndex: number, element: HTMLDivElement | null) => {
    slideRefs.current[domIndex] = element
  }, [])

  const getViewportWidth = useCallback(() => {
    const viewport = trackRef.current?.parentElement
    return viewport?.clientWidth ?? 0
  }, [])

  const getSlideWidth = useCallback(() => {
    const viewportWidth = getViewportWidth()
    if (viewportWidth <= 0) return 0

    if (!slideWidthUnit) return viewportWidth

    return Math.max(slideWidthUnit, Math.floor(viewportWidth / slideWidthUnit) * slideWidthUnit)
  }, [getViewportWidth, slideWidthUnit])

  const getScrollStep = useCallback(() => {
    const slideWidth = getSlideWidth()
    return slideWidth > 0 ? slideWidth + CAROUSEL_GAP_PX : 0
  }, [getSlideWidth])

  const getScrollLeftForDomIndex = useCallback(
    (domIndex: number) => {
      const step = getScrollStep()
      return step > 0 ? domIndex * step : 0
    },
    [getScrollStep]
  )

  const syncSlideWidths = useCallback(() => {
    const slideWidth = getSlideWidth()
    if (slideWidth <= 0) return

    slideRefs.current.forEach((slide) => {
      if (!slide) return
      slide.style.flex = `0 0 ${slideWidth}px`
      slide.style.width = `${slideWidth}px`
    })
  }, [getSlideWidth])

  const setLogicalIndex = useCallback((logicalIndex: number) => {
    if (activeIndexRef.current === logicalIndex) return

    activeIndexRef.current = logicalIndex
    setActiveIndex(logicalIndex)
    setProgressKey((key) => key + 1)
  }, [])

  const jumpToDomIndex = useCallback(
    (domIndex: number) => {
      const track = trackRef.current
      if (!track) return

      isRepositioningRef.current = true
      track.scrollLeft = getScrollLeftForDomIndex(domIndex)
      requestAnimationFrame(() => {
        isRepositioningRef.current = false
      })
    },
    [getScrollLeftForDomIndex]
  )

  const scrollToDomIndex = useCallback(
    (domIndex: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current
      if (!track) return

      track.scrollTo({
        left: getScrollLeftForDomIndex(domIndex),
        behavior,
      })
    },
    [getScrollLeftForDomIndex]
  )

  const getDomIndexFromScroll = useCallback(() => {
    const track = trackRef.current
    const step = getScrollStep()
    if (!track || step <= 0) return loopEnabled ? 1 : 0

    return Math.round(track.scrollLeft / step)
  }, [getScrollStep, loopEnabled])

  const repositionIfNeeded = useCallback(() => {
    if (!loopEnabled) return false

    const track = trackRef.current
    const step = getScrollStep()
    if (!track || step <= 0) return false

    const domIndex = getDomIndexFromScroll()
    const cloneEndScrollLeft = getScrollLeftForDomIndex(slideCount + 1)
    const cloneStartScrollLeft = getScrollLeftForDomIndex(0)

    if (domIndex >= slideCount + 1 && Math.abs(track.scrollLeft - cloneEndScrollLeft) <= 2) {
      jumpToDomIndex(1)
      setLogicalIndex(0)
      return true
    }

    if (domIndex <= 0 && Math.abs(track.scrollLeft - cloneStartScrollLeft) <= 2) {
      jumpToDomIndex(slideCount)
      setLogicalIndex(slideCount - 1)
      return true
    }

    return false
  }, [
    getDomIndexFromScroll,
    getScrollLeftForDomIndex,
    getScrollStep,
    jumpToDomIndex,
    loopEnabled,
    setLogicalIndex,
    slideCount,
  ])

  const settleScroll = useCallback(() => {
    if (isRepositioningRef.current) return

    syncSlideWidths()

    const track = trackRef.current
    const step = getScrollStep()
    if (!track || step <= 0) return

    const nearestDomIndex = getDomIndexFromScroll()
    const nearestScrollLeft = getScrollLeftForDomIndex(nearestDomIndex)

    if (Math.abs(track.scrollLeft - nearestScrollLeft) > 1) {
      jumpToDomIndex(nearestDomIndex)
    }

    if (repositionIfNeeded()) return

    setLogicalIndex(domToLogicalIndex(nearestDomIndex, slideCount))
  }, [
    getDomIndexFromScroll,
    getScrollLeftForDomIndex,
    getScrollStep,
    jumpToDomIndex,
    repositionIfNeeded,
    setLogicalIndex,
    slideCount,
    syncSlideWidths,
  ])

  const goTo = useCallback(
    (logicalIndex: number) => {
      if (slideCount === 0) return
      const normalizedIndex = Math.max(0, Math.min(logicalIndex, slideCount - 1))
      setLogicalIndex(normalizedIndex)
      scrollToDomIndex(logicalToDomIndex(normalizedIndex, slideCount), 'smooth')
    },
    [scrollToDomIndex, setLogicalIndex, slideCount]
  )

  const goToNext = useCallback(() => {
    if (slideCount <= 1) return

    const currentIndex = activeIndexRef.current
    if (currentIndex === slideCount - 1) {
      setLogicalIndex(0)
      scrollToDomIndex(slideCount + 1, 'smooth')
      return
    }

    const nextIndex = currentIndex + 1
    setLogicalIndex(nextIndex)
    scrollToDomIndex(logicalToDomIndex(nextIndex, slideCount), 'smooth')
  }, [scrollToDomIndex, setLogicalIndex, slideCount])

  const goToPrevious = useCallback(() => {
    if (slideCount <= 1) return

    const currentIndex = activeIndexRef.current
    if (currentIndex === 0) {
      setLogicalIndex(slideCount - 1)
      scrollToDomIndex(0, 'smooth')
      return
    }

    const previousIndex = currentIndex - 1
    setLogicalIndex(previousIndex)
    scrollToDomIndex(logicalToDomIndex(previousIndex, slideCount), 'smooth')
  }, [scrollToDomIndex, setLogicalIndex, slideCount])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useLayoutEffect(() => {
    syncSlideWidths()
    if (loopEnabled) {
      jumpToDomIndex(1)
    }
  }, [jumpToDomIndex, loopEnabled, slideCount, syncSlideWidths])

  useEffect(() => {
    const viewport = trackRef.current?.parentElement
    if (!viewport) return

    const observer = new ResizeObserver(() => {
      syncSlideWidths()
      if (loopEnabled) {
        jumpToDomIndex(logicalToDomIndex(activeIndexRef.current, slideCount))
      }
    })

    observer.observe(viewport)
    return () => observer.disconnect()
  }, [jumpToDomIndex, loopEnabled, slideCount, syncSlideWidths])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let settleTimer: number | undefined

    const scheduleSettle = () => {
      if (isRepositioningRef.current) return

      if (settleTimer) window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        settleScroll()
      }, 120)
    }

    const handleScrollEnd = () => {
      if (settleTimer) window.clearTimeout(settleTimer)
      settleScroll()
    }

    const handleResize = () => {
      syncSlideWidths()
      jumpToDomIndex(logicalToDomIndex(activeIndexRef.current, slideCount))
    }

    track.addEventListener('scroll', scheduleSettle, { passive: true })
    track.addEventListener('scrollend', handleScrollEnd)
    window.addEventListener('resize', handleResize)

    return () => {
      if (settleTimer) window.clearTimeout(settleTimer)
      track.removeEventListener('scroll', scheduleSettle)
      track.removeEventListener('scrollend', handleScrollEnd)
      window.removeEventListener('resize', handleResize)
    }
  }, [settleScroll])

  useEffect(() => {
    if (!autoAdvance) return
    if (!isInView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setTimeout(() => {
      goToNext()
    }, autoAdvanceMs)

    return () => window.clearTimeout(timer)
  }, [activeIndex, progressKey, autoAdvanceMs, autoAdvance, goToNext, isInView])

  return {
    trackRef,
    registerSlideRef,
    activeIndex,
    progressKey,
    loopEnabled,
    goTo,
    goToPrevious,
    goToNext,
  }
}

type CarouselLightboxSlide = {
  src: string
  alt: string
  width: number
  height: number
}

function iterationSlidesForLightbox(slides: readonly Iteration1Slide[]): CarouselLightboxSlide[] {
  return slides.map((slide) => ({
    ...slide,
    width: ITERATION_SLIDE_WIDTH,
    height: ITERATION_SLIDE_HEIGHT,
  }))
}

function personaSlidesForLightbox(): CarouselLightboxSlide[] {
  return PERSONA_SLIDES.map((slide) => ({ ...slide }))
}

type CarouselImageLightboxProps = {
  slides: CarouselLightboxSlide[]
  initialIndex: number
  ariaLabel: string
  onClose: () => void
}

function CarouselImageLightbox({
  slides,
  initialIndex,
  ariaLabel,
  onClose,
}: CarouselImageLightboxProps) {
  const carousel = useCaseCarousel(slides.length, 0, { autoAdvance: false })
  const hasInitializedRef = useRef(false)
  const zoomStateRef = useRef<LightboxZoomState>({
    isExpanded: false,
    zoomOut: () => {},
  })

  const handleZoomStateChange = useCallback((state: LightboxZoomState) => {
    zoomStateRef.current = state
  }, [])

  useLayoutEffect(() => {
    hasInitializedRef.current = false
  }, [slides, initialIndex])

  useLayoutEffect(() => {
    if (hasInitializedRef.current) return
    if (slides.length === 0) return

    carousel.goTo(initialIndex)
    hasInitializedRef.current = true
  }, [carousel.goTo, initialIndex, slides.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (zoomStateRef.current.isExpanded) {
          event.preventDefault()
          zoomStateRef.current.zoomOut()
          return
        }

        onClose()
        return
      }

      if (zoomStateRef.current.isExpanded) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        carousel.goToNext()
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        carousel.goToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [carousel.goToNext, carousel.goToPrevious, onClose])

  return (
    <div
      className={styles.researchLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Carousel full screen view"
      onClick={onClose}
    >
      <button
        type="button"
        className={styles.researchLightboxClose}
        aria-label="Close full screen view"
        onClick={onClose}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className={styles.carouselLightboxPanel} onClick={(event) => event.stopPropagation()}>
        <div className={`${styles.carouselLightboxImageCarousel} ${styles.carouselLightboxCarousel}`}>
          <div className={styles.caseCarouselViewport}>
            <div
              ref={carousel.trackRef}
              className={styles.caseCarouselTrack}
              data-loop={carousel.loopEnabled ? 'true' : 'false'}
              aria-label={ariaLabel}
            >
              {getLoopSlideEntries(slides).map((entry, domIndex) => {
                const isActiveSlide =
                  !entry.isClone && entry.logicalIndex === carousel.activeIndex

                return (
                  <div
                    key={entry.key}
                    ref={(element) => carousel.registerSlideRef(domIndex, element)}
                    className={styles.caseCarouselSlide}
                    aria-hidden={entry.isClone ? true : undefined}
                  >
                    <div className={styles.carouselLightboxFigure}>
                      <LightboxZoomableImage
                        src={entry.item.src}
                        alt={entry.item.alt}
                        width={entry.item.width}
                        height={entry.item.height}
                        layout="carousel"
                        enabled={isActiveSlide}
                        resetKey={carousel.activeIndex}
                        onZoomStateChange={isActiveSlide ? handleZoomStateChange : undefined}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <CaseCarouselControls
            slideCount={slides.length}
            activeIndex={carousel.activeIndex}
            progressKey={carousel.progressKey}
            ariaLabel={ariaLabel}
            advanceDurationMs={0}
            showProgressLoader={false}
            onGoTo={carousel.goTo}
            onPrevious={carousel.goToPrevious}
            onNext={carousel.goToNext}
          />
        </div>
      </div>
    </div>
  )
}

export function PpnCasePage() {
  const stateLayerFigureRef = useRef<HTMLDivElement | null>(null)
  const [stateLayerStarted, setStateLayerStarted] = useState(false)
  const foundationsFigureRef = useRef<HTMLDivElement | null>(null)
  const [foundationsStarted, setFoundationsStarted] = useState(false)
  const bannerVideoRef = useRef<HTMLVideoElement | null>(null)
  const bannerSectionRef = useRef<HTMLElement | null>(null)
  const researchGoalCardRef = useRef<HTMLElement | null>(null)
  const researchExploreCardRef = useRef<HTMLElement | null>(null)
  const [zoomedImage, setZoomedImage] = useState<ZoomedImage | null>(null)
  const [zoomedImageCarousel, setZoomedImageCarousel] = useState<{
    slides: CarouselLightboxSlide[]
    initialIndex: number
    ariaLabel: string
  } | null>(null)
  const personaCarousel = useCaseCarousel(PERSONA_SLIDES.length, 0, { autoAdvance: false })
  const iteration1Carousel = useCaseCarousel(ITERATION1_SLIDES.length, 0, {
    autoAdvance: false,
  })
  const iteration2Carousel = useCaseCarousel(ITERATION2_SLIDES.length, 0, {
    autoAdvance: false,
  })

  const openZoomedImage = useCallback((image: ZoomedImage) => {
    setZoomedImage(image)
  }, [])

  const closeZoomedImage = useCallback(() => {
    setZoomedImage(null)
  }, [])

  const openZoomedImageCarousel = useCallback(
    (slides: CarouselLightboxSlide[], initialIndex: number, ariaLabel: string) => {
      setZoomedImageCarousel({ slides, initialIndex, ariaLabel })
    },
    []
  )

  const closeZoomedImageCarousel = useCallback(() => {
    setZoomedImageCarousel(null)
  }, [])

  useEffect(() => {
    const video = bannerVideoRef.current
    if (!video) return

    const tryPlay = () => {
      void video.play().catch(() => {})
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    return () => video.removeEventListener('loadeddata', tryPlay)
  }, [])

  useEffect(() => {
    const goalCard = researchGoalCardRef.current
    const exploreCard = researchExploreCardRef.current
    if (!goalCard || !exploreCard) return

    const syncResearchCardHeights = () => {
      goalCard.style.minHeight = ''
      exploreCard.style.minHeight = ''

      const maxHeight = Math.max(
        goalCard.getBoundingClientRect().height,
        exploreCard.getBoundingClientRect().height
      )

      if (maxHeight > 0) {
        const height = `${maxHeight}px`
        goalCard.style.minHeight = height
        exploreCard.style.minHeight = height
      }
    }

    syncResearchCardHeights()

    const observer = new ResizeObserver(syncResearchCardHeights)
    observer.observe(goalCard)
    observer.observe(exploreCard)

    window.addEventListener('resize', syncResearchCardHeights)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncResearchCardHeights)
      goalCard.style.minHeight = ''
      exploreCard.style.minHeight = ''
    }
  }, [])

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
      <CaseStudySectionNav sections={PPN_SECTIONS} bannerRef={bannerSectionRef} />
      <Container>
        <header id="top" className={styles.textContainer}>
          <span className={`body-3 ${styles.tag}`}>Product Design</span>
          <h2 className={styles.heading}>
          Building Trust in Local Service Discovery Through a 
          7-Role Hybrid B2B2C Ecosystem
          </h2>
          <p className={`body-1 ${styles.body}`}>
          People & Pets Network (PPN) is a community-driven platform connecting 
          users with trusted businesses and nonprofit organizations. To support 
          a complex ecosystem of commercial, community, and government stakeholders, 
          I designed end-to-end experiences across seven interconnected user roles.
          </p>
        </header>
      </Container>

      <section
        ref={bannerSectionRef}
        className={styles.imageScrollArea}
        aria-label="Case study visual"
      >
        <div className={styles.imageStickyFrame}>
          <video
            ref={bannerVideoRef}
            key={BANNER_VIDEO_SRC}
            src={BANNER_VIDEO_SRC}
            className={styles.caseVideo}
            autoPlay
            loop
            playsInline
            preload="auto"
            aria-label="PPN case study banner"
            {...protectedVideoProps}
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
                    PPN is a hybrid B2B & B2C platform connecting service 
                    seekers with service providers, including businesses and 
                    NGOs. The platform was designed to bring a fragmented ecosystem 
                    together. This gave providers visibility, helping seekers find the 
                    right services, and making NGO resources easier to discover.
                    </p>
                    <p className={`body-2 ${styles.mainBody}`}>
                    This wasn't a single-user product. Thus, the challenge became 
                    architecting an ecosystem where different users, permissions, 
                    and workflows had to work together.
                    </p>
                  </div>
                  <div className={styles.overviewCards}>
                    <article className={`${styles.overviewCard} ${styles.overviewCardWide}`}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Role</p>
                      <p className={`body-2 ${styles.cardText}`}>
                        End-to-end product design including research synthesis, problem framing,
                        persona development, flows, and final UI.
                      </p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Team</p>
                      <p className={`body-2 ${styles.cardText}`}>2 Product Designers, 1 Product Manager, 2 Developers, 1 QA</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Constraint</p>
                      <p className={`body-2 ${styles.cardText}`}>No direct access to users</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Duration</p>
                      <p className={`body-2 ${styles.cardText}`}>6 months</p>
                    </article>
                  </div>
                </section>

                <section id="Research" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Research</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      We had no access to real users at any stage of this project. So, I grounded every 
                      design decision in client-provided research notes and our own secondary
                      research.
                    </p>
                  </div>

                  <div className={styles.researchCards}>
                    <article
                      ref={researchGoalCardRef}
                      className={styles.researchGoalCard}
                    >
                      <p className={`body-2 ${styles.researchCardEyebrow}`}>
                        What we got from the client:
                      </p>
                      <ul className={styles.researchGoalList}>
                        {RESEARCH_CLIENT_DELIVERABLES.map((item) => (
                          <li key={item} className={`body-2 ${styles.researchGoalListItem}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>

                    <article
                      ref={researchExploreCardRef}
                      className={styles.researchExploreCard}
                    >
                      <p className={`body-2 ${styles.researchCardEyebrow}`}>
                        What we built from it:
                      </p>
                      <div className={styles.researchExploreTags}>
                        {RESEARCH_BUILT_OUTPUTS.map((tag) => (
                          <span
                            key={tag}
                            className={`body-3 ${styles.researchExploreTag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  </div>
                </section>

                <section id="competitor-analysis" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Competitor Benchmarking</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      There was no direct competitor to PPN, so I looked into adjacent platforms
                      this included-
                    </p>
                    <ol className={styles.finalFlowList}>
                      <li className={`body-2 ${styles.finalFlowListItem}`}>
                        <strong>Service Platforms</strong>: Thumbtack, Angi, Bark
                      </li>
                      <li className={`body-2 ${styles.finalFlowListItem}`}>
                        <strong>Business Discovery</strong>: Yelp, Google Business
                      </li>
                      <li className={`body-2 ${styles.finalFlowListItem}`}>
                        <strong>Community Platforms</strong>: Facebook Groups, Nextdoor
                      </li>
                      <li className={`body-2 ${styles.finalFlowListItem}`}>
                        <strong>Volunteer Platform</strong>: Volunteer Match, Idealist
                      </li>
                    </ol>
                    <p className={`body-2 ${styles.mainBody}`}>
                      There were three factors on which I based my research:
                    </p>
                  </div>
                  <div className={styles.competitorFigure}>
                    <img
                      src={COMPETITORS_IMAGE_SRC}
                      alt={COMPETITORS_IMAGE_ALT}
                      className={`${styles.competitorImage} ${styles.figureZoomableImage}`}
                      width={3548}
                      height={1788}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: COMPETITORS_IMAGE_SRC,
                          alt: COMPETITORS_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View competitor benchmarking notes full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: COMPETITORS_IMAGE_SRC,
                          alt: COMPETITORS_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="Problem" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Defining the Problem</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    The main problem was fragmentation as existing platforms solved individual 
                    parts of the problem. I, therefore, mapped the problem in relation to 
                    our 3 primary users.
                    </p>
                  </div>

                  <div className={styles.problemCards}>
                    {PROBLEM_CARDS.map((card) => (
                      <article
                        key={card.title}
                        className={`${styles.problemCard} ${
                          card.layout === 'wide' ? styles.problemCardWide : ''
                        }`}
                      >
                        <div
                          className={styles.problemCardSurface}
                          style={{ backgroundColor: card.backgroundColor }}
                        >
                          <span className={`body-3 ${styles.problemCardEyebrow}`}>
                            {card.eyebrow}
                          </span>
                          <h4 className={`h4 ${styles.problemCardHeading}`}>{card.title}</h4>
                          <p className={`body-3 ${styles.problemCardBody}`}>{card.body}</p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <p className={`body-2 ${styles.problemStatementLead}`}>
                    the question that we solved for, then, became:
                  </p>

                  <article className={styles.problemStatementCard}>
                    <p className={styles.problemStatementEyebrow}>How Might We?</p>
                    <div className={styles.problemStatementInner}>
                      <p className={`body-2 ${styles.problemStatementBody}`}>
                      Bring service discovery, customer satisfaction, and community trust
                      into one connected ecosystem while supporting the different needs, 
                      responsibilities, and permissions of the users within it?
                      </p>
                    </div>
                  </article>
                </section>

                <section id="personas" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>The 7-persona ecosystem </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    It was important to treat personas as a part of a larger ecosystem. 
                    Thus, after we created the personas, I mapped each persona in relation to the others.
                    </p>
                  </div>
                  <div className={styles.personaCarousel}>
                    <div className={styles.caseCarouselViewport}>
                      <div
                        ref={personaCarousel.trackRef}
                        className={styles.caseCarouselTrack}
                        data-loop={personaCarousel.loopEnabled ? 'true' : 'false'}
                        aria-label="Persona ecosystem images"
                      >
                        {getLoopSlideEntries(PERSONA_SLIDES).map((entry, domIndex) => (
                          <div
                            key={entry.key}
                            ref={(element) => personaCarousel.registerSlideRef(domIndex, element)}
                            className={styles.caseCarouselSlide}
                            aria-hidden={entry.isClone ? true : undefined}
                          >
                            <div className={styles.personaSlideFigure}>
                              <img
                                src={entry.item.src}
                                alt={entry.item.alt}
                                className={`${styles.personaImage} ${styles.figureZoomableImage}`}
                                width={entry.item.width}
                                height={entry.item.height}
                                draggable={false}
                                onClick={
                                  entry.isClone || entry.logicalIndex === null
                                    ? undefined
                                    : () =>
                                        openZoomedImageCarousel(
                                          personaSlidesForLightbox(),
                                          entry.logicalIndex as number,
                                          'Persona ecosystem navigation'
                                        )
                                }
                              />
                              {!entry.isClone && entry.logicalIndex !== null ? (
                                <FigureZoomButton
                                  label={`View ${entry.item.alt} full screen`}
                                  onClick={() =>
                                    openZoomedImageCarousel(
                                      personaSlidesForLightbox(),
                                      entry.logicalIndex as number,
                                      'Persona ecosystem navigation'
                                    )
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <CaseCarouselControls
                      slideCount={PERSONA_SLIDES.length}
                      activeIndex={personaCarousel.activeIndex}
                      progressKey={personaCarousel.progressKey}
                      ariaLabel="Persona ecosystem navigation"
                      advanceDurationMs={0}
                      showProgressLoader={false}
                      onGoTo={personaCarousel.goTo}
                      onPrevious={personaCarousel.goToPrevious}
                      onNext={personaCarousel.goToNext}
                    />
                  </div>
                </section>

                <section id="information-architecture" className={styles.caseSection}>
                <h3 className={styles.mainHeading}>Structuring the platform architecture</h3>
                <div className={styles.bodyStack}>
                  <p className={`body-2 ${styles.mainBody}`}>
                  My team and I structured the information architecture together ensuring
                  everyone was on the same page. I lead the process by separating the platform 
                  into distinct user roles, then mapping the features and workflows relevant to them.
                  </p>
                </div>
                <div className={styles.architectureFigure}>
                  <img
                    src={ARCHITECTURE_IMAGE_SRC}
                    alt={ARCHITECTURE_IMAGE_ALT}
                    className={`${styles.architectureImage} ${styles.figureZoomableImage}`}
                    width={11257}
                    height={16383}
                    draggable={false}
                    onClick={() =>
                      openZoomedImage({
                        src: ARCHITECTURE_IMAGE_SRC,
                        alt: ARCHITECTURE_IMAGE_ALT,
                      })
                    }
                  />
                  <FigureZoomButton
                    label="View platform architecture image full screen"
                    onClick={() =>
                      openZoomedImage({
                        src: ARCHITECTURE_IMAGE_SRC,
                        alt: ARCHITECTURE_IMAGE_ALT,
                      })
                    }
                  />
                </div>
              </section>

              <section id="service-design" className={styles.caseSection}>
                <h3 className={styles.mainHeading}>Designing the service blueprint</h3>
                <div className={styles.bodyStack}>
                  <p className={`body-2 ${styles.mainBody}`}>
                    Since there were 7 different user roles interacting within the platform,
                    it was essential to zoom into the core service journey. Consequently, I built the service 
                    blueprint to understand just that.
                  </p>
                </div>
                <div className={styles.serviceFigure}>
                  <img
                    src={SERVICE_IMAGE_SRC}
                    alt={SERVICE_IMAGE_ALT}
                    className={`${styles.serviceImage} ${styles.figureZoomableImage}`}
                    width={9830}
                    height={7432}
                    draggable={false}
                    onClick={() =>
                      openZoomedImage({
                        src: SERVICE_IMAGE_SRC,
                        alt: SERVICE_IMAGE_ALT,
                      })
                    }
                  />
                  <FigureZoomButton
                    label="View service blueprint image full screen"
                    onClick={() =>
                      openZoomedImage({
                        src: SERVICE_IMAGE_SRC,
                        alt: SERVICE_IMAGE_ALT,
                      })
                    }
                  />
                </div>
              </section>

              <section id="business-model" className={styles.caseSection}>
                <h3 className={styles.mainHeading}>Mapping the business model</h3>
                <div className={styles.bodyStack}>
                  <p className={`body-2 ${styles.mainBody}`}>
                    Understanding the business model early shaped what we designed,
                    especially around subscription forms, pricing surfaces, and
                    how non-profits were positioned differently from commercial providers.
                  </p>
                </div>

                <div className={styles.businessModelCards}>
                  {BUSINESS_MODEL_CARDS.map((card) => (
                    <article key={card.title} className={styles.businessModelCard}>
                      <span
                        className={`body-3 ${styles.businessModelEyebrow}`}
                        style={{
                          backgroundColor: card.eyebrowBackground,
                          color: card.eyebrowColor,
                        }}
                      >
                        {card.eyebrow}
                      </span>
                      <h4 className={styles.businessModelTitle}>{card.title}</h4>
                      <p className={`body-2 ${styles.businessModelBody}`}>{card.body}</p>
                    </article>
                  ))}
                </div>
              </section>

                <section id="iterations" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>The forms we almost shipped</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    There were two flows that held the most significance; the subscription flow and 
                    the submitting an enquiry flow. Therefore, we iterated on them extensively. 
                    </p>
                  </div>

                  <div className={`${styles.iterationFormLabel} ${styles.tradeOffCalloutGap32}`}>
                    <h4 className={styles.iterationFormLabelHeading}>Form 1: Enroll Subscription</h4>
                  </div>

                  <div className={styles.iterationVideoBlock}>
                    <div className={styles.finalScreenPhase}>
                      <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>Initial Iteration</p>
                      <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                        The initial iteration condensed the flow into three simple steps, but it
                        assumed users could navigate a complex interface. While this reduced step
                        count, the interface became too complicated and unsuitable for
                        non-technical users.
                      </p>
                    </div>

                    <div className={styles.iteration1Carousel}>
                      <div className={styles.caseCarouselViewport}>
                        <div
                          ref={iteration1Carousel.trackRef}
                          className={styles.caseCarouselTrack}
                          data-loop={iteration1Carousel.loopEnabled ? 'true' : 'false'}
                          aria-label="Enroll subscription iteration 1 screens"
                        >
                          {getLoopSlideEntries(ITERATION1_SLIDES).map((entry, domIndex) => (
                            <div
                              key={entry.key}
                              ref={(element) =>
                                iteration1Carousel.registerSlideRef(domIndex, element)
                              }
                              className={styles.caseCarouselSlide}
                              aria-hidden={entry.isClone ? true : undefined}
                            >
                              <div className={styles.iteration1SlideFigure}>
                                <img
                                  src={entry.item.src}
                                  alt={entry.item.alt}
                                  className={`${styles.iteration1SlideImage} ${styles.figureZoomableImage}`}
                                  width={ITERATION_SLIDE_WIDTH}
                                  height={ITERATION_SLIDE_HEIGHT}
                                  draggable={false}
                                  onClick={
                                    entry.isClone || entry.logicalIndex === null
                                      ? undefined
                                      : () =>
                                          openZoomedImageCarousel(
                                            iterationSlidesForLightbox(ITERATION1_SLIDES),
                                            entry.logicalIndex as number,
                                            'Enroll subscription iteration 1 navigation'
                                          )
                                  }
                                />
                                {!entry.isClone && entry.logicalIndex !== null ? (
                                  <FigureZoomButton
                                    label={`View ${entry.item.alt} full screen`}
                                    onClick={() =>
                                      openZoomedImageCarousel(
                                        iterationSlidesForLightbox(ITERATION1_SLIDES),
                                        entry.logicalIndex as number,
                                        'Enroll subscription iteration 1 navigation'
                                      )
                                    }
                                  />
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <CaseCarouselControls
                        slideCount={ITERATION1_SLIDES.length}
                        activeIndex={iteration1Carousel.activeIndex}
                        progressKey={iteration1Carousel.progressKey}
                        ariaLabel="Enroll subscription iteration 1 navigation"
                        advanceDurationMs={0}
                        showProgressLoader={false}
                        onGoTo={iteration1Carousel.goTo}
                        onPrevious={iteration1Carousel.goToPrevious}
                        onNext={iteration1Carousel.goToNext}
                      />
                    </div>

                    <div className={styles.finalScreenPhase}>
                      <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>Final Flow</p>
                      <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                        The final flow accepted more friction in exchange for clearer guidance.
                        Why it worked:
                      </p>
                      <ol className={styles.finalFlowList}>
                        <li className={`body-2 ${styles.finalFlowListItem}`}>
                          The steps followed a familiar subscription pattern: select subscription →
                          customize → pay.
                        </li>
                        <li className={`body-2 ${styles.finalFlowListItem}`}>
                          Users interacted with the screen more often, but each step felt more
                          intuitive and guided.
                        </li>
                        <li className={`body-2 ${styles.finalFlowListItem}`}>
                          The system automatically attached relevant documents and acted on the
                          user&apos;s behalf, avoiding duplicate work
                        </li>
                      </ol>
                    </div>

                    <div className={styles.finalScreensCarousel}>
                      <div className={styles.finalScreenFrame}>
                        <div className={styles.finalScreenVideoFigure}>
                          <CaseStudyVideoPlayer
                            key={ENROLL_SUBSCRIPTION_VIDEO_SRC}
                            src={ENROLL_SUBSCRIPTION_VIDEO_SRC}
                            ariaLabel="The final flow for a business enrolling in subscriptions"
                            autoPlayWhenVisible
                            clickToZoom
                          />
                        </div>
                        <p className={`body-2 ${styles.finalScreenCaption}`}>
                          The final flow for a business enrolling in subscriptions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${styles.iterationVideoBlock} ${styles.finalScreenBlockRepeat}`}
                  >
                    <div className={`${styles.iterationFormLabel} ${styles.tradeOffCalloutGap32}`}>
                      <h4 className={styles.iterationFormLabelHeading}>Form 2: Submit Inquiry</h4>
                    </div>

                    <div className={styles.finalScreenPhase}>
                      <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>Initial Iteration</p>
                      <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                        The point where the iteration lacked was scalability. While it was nice to
                        have the user select category and sub-category in one go, as categories
                        scaled, this would cause a problem.
                      </p>
                    </div>

                    <div className={styles.iteration1Carousel}>
                      <div className={styles.caseCarouselViewport}>
                        <div
                          ref={iteration2Carousel.trackRef}
                          className={styles.caseCarouselTrack}
                          data-loop={iteration2Carousel.loopEnabled ? 'true' : 'false'}
                          aria-label="Submit request iteration 2 screens"
                        >
                          {getLoopSlideEntries(ITERATION2_SLIDES).map((entry, domIndex) => (
                            <div
                              key={entry.key}
                              ref={(element) =>
                                iteration2Carousel.registerSlideRef(domIndex, element)
                              }
                              className={styles.caseCarouselSlide}
                              aria-hidden={entry.isClone ? true : undefined}
                            >
                              <div className={styles.iteration1SlideFigure}>
                                <img
                                  src={entry.item.src}
                                  alt={entry.item.alt}
                                  className={`${styles.iteration1SlideImage} ${styles.figureZoomableImage}`}
                                  width={ITERATION_SLIDE_WIDTH}
                                  height={ITERATION_SLIDE_HEIGHT}
                                  draggable={false}
                                  onClick={
                                    entry.isClone || entry.logicalIndex === null
                                      ? undefined
                                      : () =>
                                          openZoomedImageCarousel(
                                            iterationSlidesForLightbox(ITERATION2_SLIDES),
                                            entry.logicalIndex as number,
                                            'Submit request iteration 2 navigation'
                                          )
                                  }
                                />
                                {!entry.isClone && entry.logicalIndex !== null ? (
                                  <FigureZoomButton
                                    label={`View ${entry.item.alt} full screen`}
                                    onClick={() =>
                                      openZoomedImageCarousel(
                                        iterationSlidesForLightbox(ITERATION2_SLIDES),
                                        entry.logicalIndex as number,
                                        'Submit request iteration 2 navigation'
                                      )
                                    }
                                  />
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <CaseCarouselControls
                        slideCount={ITERATION2_SLIDES.length}
                        activeIndex={iteration2Carousel.activeIndex}
                        progressKey={iteration2Carousel.progressKey}
                        ariaLabel="Submit request iteration 2 navigation"
                        advanceDurationMs={0}
                        showProgressLoader={false}
                        onGoTo={iteration2Carousel.goTo}
                        onPrevious={iteration2Carousel.goToPrevious}
                        onNext={iteration2Carousel.goToNext}
                      />
                    </div>

                    <div className={styles.finalScreenPhase}>
                      <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>Final Iteration</p>
                      <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                        After internal testing, we proposed a restructured flow-
                      </p>
                      <ol className={styles.finalFlowList}>
                        <li className={`body-2 ${styles.finalFlowListItem}`}>
                          Category and sub-category were separated into distinct steps, making the
                          hierarchy clearer and easier to scale.
                        </li>
                        <li className={`body-2 ${styles.finalFlowListItem}`}>
                          Forms were reorganized so related fields stayed together. Time slots and
                          date slots were made more flexible, giving users real options instead of
                          restrictive presets.
                        </li>
                        <li className={`body-2 ${styles.finalFlowListItem}`}>
                          Addresses were attached to contact details and saved together. Users could
                          pick from what was already saved and set a default, instead of the system
                          guessing.
                        </li>
                      </ol>
                    </div>

                    <div className={styles.finalScreensCarousel}>
                      <div className={styles.finalScreenFrame}>
                        <div className={styles.finalScreenVideoFigure}>
                          <CaseStudyVideoPlayer
                            key={SUBMIT_REQUEST_VIDEO_SRC}
                            src={SUBMIT_REQUEST_VIDEO_SRC}
                            ariaLabel="The final flow for a user to create and submit a request"
                            autoPlayWhenVisible
                            clickToZoom
                          />
                        </div>
                        <p className={`body-2 ${styles.finalScreenCaption}`}>
                          The final flow for a user to create and submit a request
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="finals" className={styles.caseSection}>
                  <div className={styles.finalScreenIntro}>
                    <h3 className={styles.mainHeading}>Final Screens
                    </h3>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Here is what the final screens looked like:
                    </p>
                  </div>

                  <div className={styles.finalScreenStack}>
                    {FINAL_SCREEN_SEGMENTS.map((segment) => (
                      <div key={segment.caption} className={styles.finalScreenStackEntry}>
                        {segment.intro ? (
                          <div className={styles.finalScreenPhase}>
                            <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>
                              {segment.intro.heading}
                            </p>
                            {segment.intro.body ? (
                              <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                                {segment.intro.body}
                              </p>
                            ) : null}
                            {segment.intro.decisionsLead ? (
                              <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                                {segment.intro.decisionsLead}
                              </p>
                            ) : null}
                            {segment.intro.decisionItems?.length ? (
                              <ol className={styles.finalFlowList}>
                                {segment.intro.decisionItems.map((item) => (
                                  <li
                                    key={item}
                                    className={`body-2 ${styles.finalFlowListItem}`}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ol>
                            ) : null}
                          </div>
                        ) : null}

                        <div className={styles.finalScreenFrame}>
                          <div className={styles.finalScreenVideoFigure}>
                            <CaseStudyVideoPlayer
                              key={segment.src}
                              src={segment.src}
                              ariaLabel={segment.caption}
                              autoPlayWhenVisible
                              clickToZoom
                            />
                          </div>
                          <p className={`body-2 ${styles.finalScreenCaption}`}>{segment.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="impact" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>
                  Impact
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Although the product has since been replaced, the work established a clearer foundation for how PPN could bring seekers, service providers, communities, and local authorities into one connected platform.
                    </p>
                  </div>

                  <aside className={`${styles.tradeOffCallout} ${styles.impactCallout}`}>
                    <p className={`body-2 ${styles.impactCalloutBody}`}>
                      At launch, the clients told us about three wins. Businesses received every lead
                      as it came in, which put them on equal footing with larger competitors. They
                      had easy access to chat, and their dashboards were simple to read. Platform
                      admins found their controls immediately, and the organized data made initial
                      setup easier. Users found creating requests effortless. They could, now, get
                      local prices with the same familiarity as other service models.
                    </p>
                  </aside>
                </section>

                <section id="learnings" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>What I learnt</h3>
                  <div className={styles.bodyStack}>
                    <ol className={styles.learningsList}>
                      <li className={`body-2 ${styles.mainBody} ${styles.learningsListItem}`}>
                        When dealing with multiple role, understanding who does what, when, and why
                        became the foundation for the design.
                      </li>
                      <li className={`body-2 ${styles.mainBody} ${styles.learningsListItem}`}>
                        Clients do not understand service blueprints, information architecture, and
                        other UX artefacts a lot of time. However, they helped establish a reference
                        point for collaboration.
                      </li>
                      <li className={`body-2 ${styles.mainBody} ${styles.learningsListItem}`}>
                        PPN taught me to think of ecosystems where different users interacted. Thus,
                        admin&apos;s and local representative&apos;s role in managing the platform
                        directly became a significant point of deliberation rather than an
                        afterthought.
                      </li>
                    </ol>
                  </div>
                </section>
              </div>
            </div>
        </section>
      </Container>

      {zoomedImage ? <ResearchImageLightbox image={zoomedImage} onClose={closeZoomedImage} /> : null}
      {zoomedImageCarousel ? (
        <CarouselImageLightbox
          slides={zoomedImageCarousel.slides}
          initialIndex={zoomedImageCarousel.initialIndex}
          ariaLabel={zoomedImageCarousel.ariaLabel}
          onClose={closeZoomedImageCarousel}
        />
      ) : null}
    </main>
  )
}
