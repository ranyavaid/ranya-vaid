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
import styles from './TripPlanningCasePage.module.css'
import fiveWhysImageVersion from 'virtual:public-asset-version/Trip-planning/5-whys.png'
import primaryResearchImageVersion from 'virtual:public-asset-version/Trip-planning/primary-research.png'
import roseThornImageVersion from 'virtual:public-asset-version/Trip-planning/rose-thorn.png'
import effortImpactMatrixImageVersion from 'virtual:public-asset-version/Trip-planning/effort-impact-matrix.png'
import personaImageVersion from 'virtual:public-asset-version/Trip-planning/persona.png'
import userFlowImageVersion from 'virtual:public-asset-version/Trip-planning/user_flow.png'
import iteration1ImageVersion from 'virtual:public-asset-version/Trip-planning/iteration_1.png'
import iteration2ImageVersion from 'virtual:public-asset-version/Trip-planning/iteration_2.png'
import rolloutImageVersion from 'virtual:public-asset-version/Trip-planning/rollout.svg'

const PRIMARY_RESEARCH_IMAGE_SRC = `/Trip-planning/primary-research.png?v=${primaryResearchImageVersion}`
const PRIMARY_RESEARCH_IMAGE_ALT =
  'Primary research synthesis from Reddit threads and blogs'
const FIVE_WHYS_IMAGE_SRC = `/Trip-planning/5-whys.png?v=${fiveWhysImageVersion}`
const FIVE_WHYS_IMAGE_ALT =
  'Five whys analysis for group trip planning challenges'
const ROSE_THORN_IMAGE_SRC = `/Trip-planning/rose-thorn.png?v=${roseThornImageVersion}`
const ROSE_THORN_IMAGE_ALT =
  'Rose-Bud-Thorn analysis of trip planning competitors and alternatives'
const EFFORT_IMPACT_MATRIX_IMAGE_SRC = `/Trip-planning/effort-impact-matrix.png?v=${effortImpactMatrixImageVersion}`
const EFFORT_IMPACT_MATRIX_IMAGE_ALT =
  'Effort-impact matrix for trip planning features'
const PERSONA_IMAGE_SRC = `/Trip-planning/persona.png?v=${personaImageVersion}`
const PERSONA_IMAGE_ALT = 'User personas for trip planning collaboration'
const USER_FLOW_IMAGE_SRC = `/Trip-planning/user_flow.png?v=${userFlowImageVersion}`
const USER_FLOW_IMAGE_ALT =
  'User flow for creating a vacation, adding collaborators, and building an itinerary'
const ROLLOUT_IMAGE_SRC = `/Trip-planning/rollout.svg?v=${rolloutImageVersion}`
const ROLLOUT_IMAGE_ALT = 'Phased feature rollout plan for trip planning'
const ITERATION_SLIDES = [
  {
    src: `/Trip-planning/iteration_1.png?v=${iteration1ImageVersion}`,
    alt: 'Trip planning iteration 1 wireframe',
  },
  {
    src: `/Trip-planning/iteration_2.png?v=${iteration2ImageVersion}`,
    alt: 'Trip planning iteration 2 wireframe',
  },
] as const
const CAROUSEL_AUTO_ADVANCE_MS = 6000

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

function useCarouselAutoAdvanceTrigger() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [inViewport, setInViewport] = useState(false)
  const [engaged, setEngaged] = useState(false)

  useEffect(() => {
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry?.isIntersecting ?? false)
      },
      { threshold: 0 }
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [root])

  useEffect(() => {
    if (!root) return

    const handlePointerEnter = () => setEngaged(true)
    const handlePointerLeave = (event: PointerEvent) => {
      const relatedTarget = event.relatedTarget
      if (relatedTarget instanceof Node && root.contains(relatedTarget)) return
      setEngaged(false)
    }
    const handleFocusIn = () => setEngaged(true)
    const handleFocusOut = (event: FocusEvent) => {
      const relatedTarget = event.relatedTarget
      if (relatedTarget instanceof Node && root.contains(relatedTarget)) return
      setEngaged(false)
    }

    root.addEventListener('pointerenter', handlePointerEnter)
    root.addEventListener('pointerleave', handlePointerLeave)
    root.addEventListener('focusin', handleFocusIn)
    root.addEventListener('focusout', handleFocusOut)

    return () => {
      root.removeEventListener('pointerenter', handlePointerEnter)
      root.removeEventListener('pointerleave', handlePointerLeave)
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('focusout', handleFocusOut)
    }
  }, [root])

  return { setRoot, isActive: inViewport || engaged }
}

function useCaseCarousel(
  slideCount: number,
  autoAdvanceMs: number,
  options?: { autoAdvance?: boolean; isInView?: boolean }
) {
  const autoAdvance = options?.autoAdvance ?? true
  const isInView = options?.isInView ?? false
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

  const getScrollStep = useCallback(() => {
    const viewportWidth = getViewportWidth()
    return viewportWidth > 0 ? viewportWidth + CAROUSEL_GAP_PX : 0
  }, [getViewportWidth])

  const getScrollLeftForDomIndex = useCallback(
    (domIndex: number) => {
      const step = getScrollStep()
      return step > 0 ? domIndex * step : 0
    },
    [getScrollStep]
  )

  const syncSlideWidths = useCallback(() => {
    const viewportWidth = getViewportWidth()
    if (viewportWidth <= 0) return

    slideRefs.current.forEach((slide) => {
      if (!slide) return
      slide.style.flex = `0 0 ${viewportWidth}px`
      slide.style.width = `${viewportWidth}px`
    })
  }, [getViewportWidth])

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

const IMPACT_CARDS = [
  {
    number: '01',
    title: 'More bookings through end-to-end engagement',
    body: 'A smoother planning experience can keep groups within the Cleartrip ecosystem for longer, creating a clearer path from trip planning and decision-making to booking.',
    color: '#fff3b0',
    numberColor: '#614B00',
    wide: false,
  },
  {
    number: '02',
    title: 'Streamlined group collaboration',
    body: 'Shared itineraries, role assignment, checklists, and collaborative decisions give groups one place to organise plans, reducing the friction of coordinating across multiple tools and conversations.',
    color: '#FFCCF1',
    numberColor: '#8A0064',
    wide: false,
  },
  {
    number: '03',
    title: 'Organic growth through collaboration',
    body: 'When users invite friends and fellow travellers into a shared trip, collaboration naturally brings new users into the product and introduces them to the broader Cleartrip ecosystem.',
    color: '#b8e6ff',
    numberColor: '#0054F3',
    wide: true,
  },
] as const

const NEXT_STEP_CARDS = [
  {
    eyebrow: 'Validate with deeper user research',
    body: "Test the experience with real groups to uncover friction around decision-making, coordination, and planning. I'd specifically look for where users still rely on external tools or drop out of the planning flow.",
    eyebrowBackground: '#FFCCF1',
    eyebrowColor: '#8A0064',
  },
  {
    eyebrow: 'Improve accessibility',
    body: 'Evaluate the experience across different accessibility needs, focusing on navigation, screen-reader compatibility, contrast, and adaptable text sizes.',
    eyebrowBackground: '#fff3b0',
    eyebrowColor: '#614B00',
  },
  {
    eyebrow: 'Extend the planning ecosystem',
    body: 'Explore integrations such as calendar sync and language translation to make the experience more useful throughout the trip, not just during initial planning.',
    eyebrowBackground: '#b8e6ff',
    eyebrowColor: '#0054F3',
  },
  {
    eyebrow: 'Measure and iterate',
    body: "Once launched, I'd evaluate whether the feature is actually improving collaboration and moving users closer to booking with metrics such as trip creation rates, collaboration rates, planning-to-booking conversions, time-to-finalize plan, and drop-off points.",
    eyebrowBackground: '#F9EECE',
    eyebrowColor: '#614B00',
  },
] as const

export function TripPlanningCasePage() {
  const processFigureRef = useRef<HTMLDivElement | null>(null)
  const processVideoRef = useRef<HTMLVideoElement | null>(null)
  const processFinishedRef = useRef(false)
  const [processStarted, setProcessStarted] = useState(false)
  const stateLayerFigureRef = useRef<HTMLDivElement | null>(null)
  const [stateLayerStarted, setStateLayerStarted] = useState(false)
  const foundationsFigureRef = useRef<HTMLDivElement | null>(null)
  const [foundationsStarted, setFoundationsStarted] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<ZoomedImage | null>(null)

  const openZoomedImage = useCallback((image: ZoomedImage) => {
    setZoomedImage(image)
  }, [])

  const closeZoomedImage = useCallback(() => {
    setZoomedImage(null)
  }, [])

  const iterationCarouselTrigger = useCarouselAutoAdvanceTrigger()
  const iterationCarousel = useCaseCarousel(ITERATION_SLIDES.length, CAROUSEL_AUTO_ADVANCE_MS, {
    isInView: iterationCarouselTrigger.isActive,
  })

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
    if (!processStarted || processFinishedRef.current) return

    const video = processVideoRef.current
    if (!video) return

    const tryPlay = () => {
      if (processFinishedRef.current || video.ended) return
      void video.play().catch(() => {})
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      tryPlay()
    } else {
      video.addEventListener('loadedmetadata', tryPlay, { once: true })
      return () => video.removeEventListener('loadedmetadata', tryPlay)
    }
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
          <span className={`body-3 ${styles.tag}`}>Design Exploration</span>
          <h2 className={styles.heading}>
            Streamlining Trip Collaboration and Making Planning Frictionless
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
                  <h3 className={styles.mainHeading}>The Challenge</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    3 friends are planning to go on a trip (Japan) together. 
                    However, they need a way to collaborate and finalise the 
                    plan including a detailed itinerary on Cleartrip app. 
                    Create a solution that enables them to incorporate s
                    uggestions from each friend and finalise on a plan.
                    </p>
                  </div>
                  <div className={styles.overviewCards}>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Role</p>
                      <p className={`body-2 ${styles.cardText}`}>Product Designer, UX Researcher</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Duration</p>
                      <p className={`body-2 ${styles.cardText}`}>3-4 days</p>
                    </article>
                  </div>
                </section>

                <section id="discovery" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Primary Research </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      To conduct in-depth primary research, I primarily relied
                      on secondary sources to understand the problem space
                      through{' '}
                      <span className={styles.textSemibold}>
                        Reddit Threads &amp; Blogs
                      </span>
                      .
                    </p>
                  </div>
                  <div className={styles.researchFigure}>
                    <img
                      src={PRIMARY_RESEARCH_IMAGE_SRC}
                      alt={PRIMARY_RESEARCH_IMAGE_ALT}
                      className={`${styles.researchImage} ${styles.figureZoomableImage}`}
                      width={1080}
                      height={580}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: PRIMARY_RESEARCH_IMAGE_SRC,
                          alt: PRIMARY_RESEARCH_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View primary research image full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: PRIMARY_RESEARCH_IMAGE_SRC,
                          alt: PRIMARY_RESEARCH_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="trade-offs" className={`${styles.caseSection} ${styles.afterResearchSection}`}>
                  <h3 className={styles.mainHeading}>
                    Digging Deeper: Why Does This Problem Exist?
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      To understand the root cause beyond the effects of the
                      problem, I did the 5 why analysis.
                    </p>
                  </div>
                  <div className={styles.whysFigure}>
                    <img
                      src={FIVE_WHYS_IMAGE_SRC}
                      alt={FIVE_WHYS_IMAGE_ALT}
                      className={`${styles.whysImage} ${styles.figureZoomableImage}`}
                      width={1216}
                      height={706}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: FIVE_WHYS_IMAGE_SRC,
                          alt: FIVE_WHYS_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View five whys analysis full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: FIVE_WHYS_IMAGE_SRC,
                          alt: FIVE_WHYS_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Turns out time, resources, and low participation were
                      visible symptoms. However, the real issue lies in
                      participation itself.{' '}
                      <span className={styles.highlightEmphasis}>
                        When people don&apos;t feel included, informed, or
                        secure in planning, they&apos;re less motivated to
                        engage.
                      </span>
                    </p>
                  </div>
                </section>

                <section id="process" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>How is the problem solved currently?</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      To better understand the problem space and identify what&apos;s
                      still missing for travelers, I conducted a Rose-Bud-Thorn
                      analysis of direct competitors like LetsJetty and Wanderlog, as
                      well as alternative solutions such as{' '}
                      <span className={styles.textSemibold}>Notion</span>,{' '}
                      <span className={styles.textSemibold}>Google Docs</span>,{' '}
                      <span className={styles.textSemibold}>WhatsApp Groups</span>,
                      and <span className={styles.textSemibold}>AI chatbots</span>.
                    </p>
                    <p className={`body-2 ${styles.mainBody}`}>
                      Read full analysis{' '}
                      <a
                        href="https://www.figma.com/board/4VYVkntK2QF1fh8DjgUtNh/Rose-Bud-Thorn-Analysis?node-id=0-1&t=ti8g9pdmisE5U2gC-1"
                        className={styles.inlineLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        here
                      </a>
                    </p>
                  </div>
                  <div className={styles.roseThornFigure}>
                    <img
                      src={ROSE_THORN_IMAGE_SRC}
                      alt={ROSE_THORN_IMAGE_ALT}
                      className={`${styles.roseThornImage} ${styles.figureZoomableImage}`}
                      width={1216}
                      height={652}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: ROSE_THORN_IMAGE_SRC,
                          alt: ROSE_THORN_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View Rose-Bud-Thorn analysis full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: ROSE_THORN_IMAGE_SRC,
                          alt: ROSE_THORN_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="user-persona" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Who we designed for?</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    I translated my research findings into user stories 
                    to capture the different needs, behaviours, and 
                    challenges of travellers. These stories helped me identify key personas.
                    </p>
                    <p className={`body-2 ${styles.mainBody}`}>
                    I intentionally chose personas that were distinct 
                    from one another, covering different traveller types 
                    and edge cases, such as selective travellers with highly 
                    specific preferences.
                    </p>
                  </div>
                  <div className={styles.userPersonaFigure}>
                    <img
                      src={PERSONA_IMAGE_SRC}
                      alt={PERSONA_IMAGE_ALT}
                      className={`${styles.userPersonaImage} ${styles.figureZoomableImage}`}
                      width={1080}
                      height={631}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: PERSONA_IMAGE_SRC,
                          alt: PERSONA_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View user personas full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: PERSONA_IMAGE_SRC,
                          alt: PERSONA_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="defining-features" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Defining & Evaluating Features</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      I started with listing all the feature and mapping them on an
                      effort-impact matrix to help me identify which ideas could
                      deliver the most value with the least effort.
                    </p>
                  </div>
                  <div className={styles.effortImpactFigure}>
                    <img
                      src={EFFORT_IMPACT_MATRIX_IMAGE_SRC}
                      alt={EFFORT_IMPACT_MATRIX_IMAGE_ALT}
                      className={`${styles.effortImpactImage} ${styles.figureZoomableImage}`}
                      width={1216}
                      height={710}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: EFFORT_IMPACT_MATRIX_IMAGE_SRC,
                          alt: EFFORT_IMPACT_MATRIX_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View effort-impact matrix full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: EFFORT_IMPACT_MATRIX_IMAGE_SRC,
                          alt: EFFORT_IMPACT_MATRIX_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                  <div className={`${styles.bodyStack} ${styles.afterEffortImpactStack}`}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      However, with a feature set this broad, shipping everything at
                      once would create unnecessary complexity and delay learning. I
                      used the matrix to define a phased rollout, prioritising features
                      that addressed core collaboration and planning needs while being
                      relatively quick to validate.
                    </p>
                  </div>
                  <div className={styles.rolloutFigure}>
                    <img
                      src={ROLLOUT_IMAGE_SRC}
                      alt={ROLLOUT_IMAGE_ALT}
                      className={styles.rolloutImage}
                      width={608}
                      height={499}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="user-flow" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>User Flow</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      I mapped the happy path for the user with the end goal for an
                      organizer to create a vacation, add collaborator and build an
                      itinerary
                    </p>
                  </div>
                  <div className={styles.userFlowFigure}>
                    <img
                      src={USER_FLOW_IMAGE_SRC}
                      alt={USER_FLOW_IMAGE_ALT}
                      className={`${styles.userFlowImage} ${styles.figureZoomableImage}`}
                      width={4004}
                      height={1390}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: USER_FLOW_IMAGE_SRC,
                          alt: USER_FLOW_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View user flow full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: USER_FLOW_IMAGE_SRC,
                          alt: USER_FLOW_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="sketches" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Early concepts  & wireframes</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    While wireframing early concepts, I critiqued the designs from 
                    the perspective of the personas I had created.
                    </p>
                  </div>

                  <div ref={iterationCarouselTrigger.setRoot} className={styles.designOptionsCarousel}>
                    <div className={styles.caseCarouselViewport}>
                      <div
                        ref={iterationCarousel.trackRef}
                        className={styles.caseCarouselTrack}
                        data-loop={iterationCarousel.loopEnabled ? 'true' : 'false'}
                        aria-label="Early concept wireframes"
                      >
                        {getLoopSlideEntries(ITERATION_SLIDES).map((entry, domIndex) => (
                          <div
                            key={entry.key}
                            ref={(element) => iterationCarousel.registerSlideRef(domIndex, element)}
                            className={styles.caseCarouselSlide}
                            aria-hidden={entry.isClone ? true : undefined}
                          >
                            <div className={styles.designOptionFigure}>
                              <img
                                src={entry.item.src}
                                alt={entry.item.alt}
                                className={`${styles.designOptionImage} ${styles.figureZoomableImage}`}
                                width={1941}
                                height={1078}
                                draggable={false}
                                onClick={
                                  entry.isClone
                                    ? undefined
                                    : () =>
                                        openZoomedImage({
                                          src: entry.item.src,
                                          alt: entry.item.alt,
                                        })
                                }
                              />
                              {!entry.isClone ? (
                                <FigureZoomButton
                                  label={`View ${entry.item.alt} full screen`}
                                  onClick={() =>
                                    openZoomedImage({
                                      src: entry.item.src,
                                      alt: entry.item.alt,
                                    })
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <CaseCarouselControls
                      slideCount={ITERATION_SLIDES.length}
                      activeIndex={iterationCarousel.activeIndex}
                      progressKey={iterationCarousel.progressKey}
                      ariaLabel="Early concept wireframe navigation"
                      advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                      showProgressLoader={iterationCarouselTrigger.isActive}
                      onGoTo={iterationCarousel.goTo}
                      onPrevious={iterationCarousel.goToPrevious}
                      onNext={iterationCarousel.goToNext}
                    />
                  </div>
                </section>

                <section id="finals" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Final Screens</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Here is what the feature looked like:
                    </p>
                  </div>

                  <div className={styles.handoffFigure}>
                    <img
                      src="/Adnet/documentation.svg"
                      alt="Badge component documentation showing anatomy, states, and usage notes"
                      className={styles.handoffImage}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="impact" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>
                    What the feature changes
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                      The solution was designed to move group travel 
                      planning from a fragmented coordination 
                      into a more collaborative journey. 
                    </p>
                  </div>

                  <div className={styles.impactCards}>
                    {IMPACT_CARDS.map((card) => (
                      <article
                        key={card.number}
                        className={`${styles.impactCard} ${card.wide ? styles.impactCardWide : ''}`}
                        style={{ backgroundColor: card.color }}
                      >
                        <span
                          className={`body-2 ${styles.impactCardNumber}`}
                          style={{ color: card.numberColor }}
                        >
                          {card.number}
                        </span>
                        <h4 className={styles.impactCardTitle}>{card.title}</h4>
                        <p className={styles.impactCardBody}>{card.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="next-steps" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Next Steps</h3>
                  <div className={styles.nextStepsCards}>
                    {NEXT_STEP_CARDS.map((card) => (
                      <article key={card.eyebrow} className={styles.nextStepCard}>
                        <span
                          className={`body-3 ${styles.nextStepEyebrow}`}
                          style={{
                            backgroundColor: card.eyebrowBackground,
                            color: card.eyebrowColor,
                          }}
                        >
                          {card.eyebrow}
                        </span>
                        <p className={`body-2 ${styles.nextStepBody}`}>{card.body}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
        </section>
      </Container>

      {zoomedImage ? <ResearchImageLightbox image={zoomedImage} onClose={closeZoomedImage} /> : null}
    </main>
  )
}
