import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Container } from '../components/layout/Container'
import styles from './PpnCasePage.module.css'
import acceptBusinessVersion from 'virtual:public-asset-version/PPN/accept_business.mp4'
import assignRepVersion from 'virtual:public-asset-version/PPN/assign_rep.mp4'
import categoriesVersion from 'virtual:public-asset-version/PPN/categories.mp4'
import enrollSubscriptionVersion from 'virtual:public-asset-version/PPN/enroll_subscription.mp4'
import competitorImageVersion from 'virtual:public-asset-version/PPN/competitor.png'
import personaImageVersion from 'virtual:public-asset-version/PPN/persona.png'
import problem1Version from 'virtual:public-asset-version/PPN/problem_1.svg'
import problem2Version from 'virtual:public-asset-version/PPN/problem_2.svg'
import problem3Version from 'virtual:public-asset-version/PPN/problem_3.svg'
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

const IMPACT_CARDS = [
  {
    number: '01',
    title: 'A community built around trust',
    body: 'We created space to highlight businesses with strong reviews, and give nonprofits and volunteers meaningful opportunities to contribute and make an impact.',
    color: '#D6F0FF',
    numberColor: '#0054F3',
    wide: false,
  },
  {
    number: '02',
    title: 'Broader discovery for local providers',
    body: 'Newer businesses often struggled to compete with established providers. By giving all providers the opportunity to pitch their services, we created a more equitable discovery experience.',
    color: '#fff3b0',
    numberColor: '#614B00',
    wide: false,
  },
  {
    number: '03',
    title: 'Complexity made manageable',
    body: 'We translated a complex ecosystem into guided workflows, making day-to-day operations easier for admins and local representatives while creating a foundation that could scale.',
    color: '#FFCCF1',
    numberColor: '#8A0064',
    wide: true,
  },
] as const

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
    src: `/PPN/problem_1.svg?v=${problem1Version}`,
    alt: 'Providers struggled to be discovered across fragmented category-specific platforms',
  },
  {
    src: `/PPN/problem_2.svg?v=${problem2Version}`,
    alt: 'Seekers lacked trust and transparency without consistent pricing, reviews, or reliable information',
  },
  {
    src: `/PPN/problem_3.svg?v=${problem3Version}`,
    alt: 'No community infrastructure to recognise good deeds or celebrate acts of kindness',
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

const ACCEPT_BUSINESS_VIDEO_SRC = `/PPN/accept_business.mp4?v=${acceptBusinessVersion}`
const ASSIGN_REP_VIDEO_SRC = `/PPN/assign_rep.mp4?v=${assignRepVersion}`
const CATEGORIES_VIDEO_SRC = `/PPN/categories.mp4?v=${categoriesVersion}`
const ENROLL_SUBSCRIPTION_VIDEO_SRC = `/PPN/enroll_subscription.mp4?v=${enrollSubscriptionVersion}`
const SUBMIT_REQUEST_VIDEO_SRC = `/PPN/submit_request.mp4?v=${submitRequestVersion}`
const BANNER_VIDEO_SRC = `/PPN/banner.mp4?v=${bannerVersion}`

type FinalScreenSlide = {
  src: string
  caption: string
}

const FINAL_SCREEN_SLIDES: FinalScreenSlide[] = [
  {
    src: ACCEPT_BUSINESS_VIDEO_SRC,
    caption: 'A business views available leads and responds to their messages',
  },
  {
    src: ASSIGN_REP_VIDEO_SRC,
    caption: 'State representative assigns county representative',
  },
  {
    src: CATEGORIES_VIDEO_SRC,
    caption: 'Admin adds and edits categories/sub-categories',
  },
]

const CAROUSEL_AUTO_ADVANCE_MS = 6000
const COMPETITOR_IMAGE_SRC = `/PPN/competitor.png?v=${competitorImageVersion}`
const COMPETITOR_IMAGE_ALT =
  'Competitor benchmarking matrix across service marketplaces, business discovery, community networks, and volunteer platforms'
const PERSONA_IMAGE_SRC = `/PPN/persona.png?v=${personaImageVersion}`
const PERSONA_IMAGE_ALT =
  'Seven-persona ecosystem map showing how all roles interact with the platform and each other'
const SERVICE_IMAGE_SRC = `/PPN/service.png?v=${serviceImageVersion}`
const SERVICE_IMAGE_ALT =
  'Service blueprint mapping user interactions, platform touchpoints, and supporting processes across the core service journey'
type Iteration1Slide = {
  src: string
  alt: string
}

const ITERATION1_SLIDES: Iteration1Slide[] = [
  {
    src: `/PPN/subs_1.png?v=${subs1ImageVersion}`,
    alt: 'Enroll subscription form step 1 showing provider business details',
  },
  {
    src: `/PPN/subs_2.png?v=${subs2ImageVersion}`,
    alt: 'Enroll subscription form step 2 showing subscription plan selection',
  },
  {
    src: `/PPN/subs_3.png?v=${subs3ImageVersion}`,
    alt: 'Enroll subscription form step 3 showing enrollment review and confirmation',
  },
]

const ITERATION2_SLIDES: Iteration1Slide[] = [
  {
    src: `/PPN/req_1.png?v=${req1ImageVersion}`,
    alt: 'Submit request form step 1 showing service category and request details',
  },
  {
    src: `/PPN/req_2.png?v=${req2ImageVersion}`,
    alt: 'Submit request form step 2 showing provider preferences and scheduling',
  },
  {
    src: `/PPN/req_3.png?v=${req3ImageVersion}`,
    alt: 'Submit request form step 3 showing request review and submission',
  },
]
const ARCHITECTURE_IMAGE_SRC = `/PPN/AI.png?v=${architectureImageVersion}`
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

type CaseStudyVideoPlayerProps = {
  src: string
  ariaLabel: string
  onVideoRef?: (element: HTMLVideoElement | null) => void
}

function CaseStudyVideoPlayer({ src, ariaLabel, onVideoRef }: CaseStudyVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const assignVideoRef = useCallback(
    (element: HTMLVideoElement | null) => {
      videoRef.current = element
      onVideoRef?.(element)
    },
    [onVideoRef]
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.load()
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      setIsEnded(false)
    }
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setIsEnded(true)
    }
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration || 0)
    const handleDurationChange = () => setDuration(video.duration || 0)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('durationchange', handleDurationChange)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('durationchange', handleDurationChange)
    }
  }, [src])

  const handleTogglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (isEnded) {
      video.currentTime = 0
      setIsEnded(false)
      void video.play().catch(() => {})
      return
    }

    if (video.paused) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const nextTime = Number(event.target.value)
    video.currentTime = nextTime
    setCurrentTime(nextTime)
    if (isEnded && nextTime < duration) {
      setIsEnded(false)
    }
  }

  const playbackLabel = isEnded ? 'Replay video' : isPlaying ? 'Pause video' : 'Play video'

  return (
    <div key={src} className={styles.caseStudyVideo}>
      <video
        key={src}
        ref={assignVideoRef}
        src={src}
        className={styles.caseStudyVideoMedia}
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label={ariaLabel}
        onContextMenu={(event) => event.preventDefault()}
      />
      <div className={styles.caseStudyVideoControls}>
        <button
          type="button"
          className={styles.caseStudyVideoButton}
          aria-label={playbackLabel}
          onClick={handleTogglePlayback}
        >
          {isEnded ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.5 8a5.5 5.5 0 1 0 1.58-3.86M2.5 3.5V8h4.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M5.5 4.5V11.5M10.5 4.5V11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M5.5 4.5L11.5 8L5.5 11.5V4.5Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <input
          type="range"
          className={styles.caseStudyVideoTimeline}
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          aria-label="Video timeline"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          onChange={handleSeek}
        />
      </div>
    </div>
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

export function PpnCasePage() {
  const stateLayerFigureRef = useRef<HTMLDivElement | null>(null)
  const [stateLayerStarted, setStateLayerStarted] = useState(false)
  const foundationsFigureRef = useRef<HTMLDivElement | null>(null)
  const [foundationsStarted, setFoundationsStarted] = useState(false)
  const bannerVideoRef = useRef<HTMLVideoElement | null>(null)
  const finalScreenBlockObserverRef = useRef<IntersectionObserver | null>(null)
  const finalScreenVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const [finalScreenBlockVisible, setFinalScreenBlockVisible] = useState(false)
  const iteration1BlockObserverRef = useRef<IntersectionObserver | null>(null)
  const iteration1VideoRef = useRef<HTMLVideoElement | null>(null)
  const [iteration1BlockVisible, setIteration1BlockVisible] = useState(false)
  const iteration2BlockObserverRef = useRef<IntersectionObserver | null>(null)
  const iteration2VideoRef = useRef<HTMLVideoElement | null>(null)
  const [iteration2BlockVisible, setIteration2BlockVisible] = useState(false)
  const researchGoalCardRef = useRef<HTMLElement | null>(null)
  const researchExploreCardRef = useRef<HTMLElement | null>(null)
  const [zoomedImage, setZoomedImage] = useState<ZoomedImage | null>(null)
  const finalScreensCarousel = useCaseCarousel(FINAL_SCREEN_SLIDES.length, 0, {
    autoAdvance: false,
  })
  const iteration1CarouselTrigger = useCarouselAutoAdvanceTrigger()
  const iteration1Carousel = useCaseCarousel(ITERATION1_SLIDES.length, CAROUSEL_AUTO_ADVANCE_MS, {
    isInView: iteration1CarouselTrigger.isActive,
  })
  const iteration2CarouselTrigger = useCarouselAutoAdvanceTrigger()
  const iteration2Carousel = useCaseCarousel(ITERATION2_SLIDES.length, CAROUSEL_AUTO_ADVANCE_MS, {
    isInView: iteration2CarouselTrigger.isActive,
  })

  const registerIteration1BlockRef = useCallback((element: HTMLDivElement | null) => {
    iteration1BlockObserverRef.current?.disconnect()
    iteration1BlockObserverRef.current = null

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIteration1BlockVisible(entry?.isIntersecting ?? false)
      },
      { threshold: 0.25 }
    )

    observer.observe(element)
    iteration1BlockObserverRef.current = observer
  }, [])

  const registerIteration2BlockRef = useCallback((element: HTMLDivElement | null) => {
    iteration2BlockObserverRef.current?.disconnect()
    iteration2BlockObserverRef.current = null

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIteration2BlockVisible(entry?.isIntersecting ?? false)
      },
      { threshold: 0.25 }
    )

    observer.observe(element)
    iteration2BlockObserverRef.current = observer
  }, [])

  const registerFinalScreenBlockRef = useCallback((element: HTMLDivElement | null) => {
    finalScreenBlockObserverRef.current?.disconnect()
    finalScreenBlockObserverRef.current = null

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFinalScreenBlockVisible(entry?.isIntersecting ?? false)
      },
      { threshold: 0.25 }
    )

    observer.observe(element)
    finalScreenBlockObserverRef.current = observer
  }, [])

  useEffect(
    () => () => {
      finalScreenBlockObserverRef.current?.disconnect()
      finalScreenBlockObserverRef.current = null
      iteration1BlockObserverRef.current?.disconnect()
      iteration1BlockObserverRef.current = null
      iteration2BlockObserverRef.current?.disconnect()
      iteration2BlockObserverRef.current = null
    },
    []
  )

  const registerFinalScreenVideoRef = useCallback(
    (slideIndex: number, element: HTMLVideoElement | null) => {
      const key = String(slideIndex)
      if (element) {
        finalScreenVideoRefs.current[key] = element
        return
      }

      delete finalScreenVideoRefs.current[key]
    },
    []
  )

  const openZoomedImage = useCallback((image: ZoomedImage) => {
    setZoomedImage(image)
  }, [])

  const closeZoomedImage = useCallback(() => {
    setZoomedImage(null)
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
    const video = iteration1VideoRef.current
    if (!video) return

    if (iteration1BlockVisible) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [iteration1BlockVisible])

  useEffect(() => {
    const video = iteration2VideoRef.current
    if (!video) return

    if (iteration2BlockVisible) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [iteration2BlockVisible])

  useEffect(() => {
    FINAL_SCREEN_SLIDES.forEach((_, slideIndex) => {
      const video = finalScreenVideoRefs.current[String(slideIndex)]
      if (!video) return

      if (finalScreenBlockVisible && slideIndex === finalScreensCarousel.activeIndex) {
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [finalScreenBlockVisible, finalScreensCarousel.activeIndex])

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
      <Container>
        <header className={styles.textContainer}>
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

      <section className={styles.imageScrollArea} aria-label="Case study visual">
        <div className={styles.imageStickyFrame}>
          <video
            ref={bannerVideoRef}
            key={BANNER_VIDEO_SRC}
            src={BANNER_VIDEO_SRC}
            className={styles.caseVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="PPN case study banner"
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
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Role</p>
                      <p className={`body-2 ${styles.cardText}`}>End-to-end feature development including research synthesis, 
                        problem framing, persona development, flows, and final UI.</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Team</p>
                      <p className={`body-2 ${styles.cardText}`}>2 Product Designers, 1 Product Manager, 2 Developers, 1 QA</p>
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
                      We had no access to real users at any stage of this project. No
                      interviews, no usability sessions, no surveys. Every design decision
                      had to be grounded in client-provided research and our own secondary
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
                    PPN didn't have a direct competitor, so we benchmarked 
                    adjacent platforms across service marketplaces, business 
                    discovery, community networks, and volunteer platforms. 
                    We looked for patterns worth carrying forward and  gaps 
                    that could serve as opportunities.
                    </p>
                  </div>
                  <div className={styles.competitorFigure}>
                    <img
                      src={COMPETITOR_IMAGE_SRC}
                      alt={COMPETITOR_IMAGE_ALT}
                      className={`${styles.competitorImage} ${styles.figureZoomableImage}`}
                      width={1620}
                      height={1383}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: COMPETITOR_IMAGE_SRC,
                          alt: COMPETITOR_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View competitor benchmarking image full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: COMPETITOR_IMAGE_SRC,
                          alt: COMPETITOR_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="Problem" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Defining the Problem</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    The research and competitor benchmarking pointed to three connected gaps. 
                    Existing platforms solved individual parts of the experience, 
                    but none brought service discovery, provider visibility, 
                    community resources, and trust into one ecosystem.
                    </p>
                  </div>

                  <div className={styles.problemCards}>
                    {PROBLEM_CARDS.map((card) => (
                      <article key={card.src} className={styles.problemCard}>
                        <div className={styles.problemCardFrame}>
                          <img
                            src={card.src}
                            alt={card.alt}
                            className={styles.problemCardImage}
                          />
                        </div>
                      </article>
                    ))}
                  </div>

                  <p className={`body-2 ${styles.problemStatementLead}`}>
                    Based on our research, the question that we solved for became
                  </p>

                  <article className={styles.problemStatementCard}>
                    <p className={styles.problemStatementEyebrow}>How Might We?</p>
                    <div className={styles.problemStatementInner}>
                      <p className={`body-2 ${styles.problemStatementBody}`}>
                      Bring service discovery, trust, and a context-specific community 
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
                    Rather than treating each persona in isolation, 
                    we first mapped the full ecosystem This included how 
                    all 7 roles interact with the platform and with each other. 
                    </p>
                  </div>
                  <div className={styles.personaFigure}>
                    <img
                      src={PERSONA_IMAGE_SRC}
                      alt={PERSONA_IMAGE_ALT}
                      className={`${styles.personaImage} ${styles.figureZoomableImage}`}
                      width={1620}
                      height={687}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: PERSONA_IMAGE_SRC,
                          alt: PERSONA_IMAGE_ALT,
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View persona ecosystem image full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: PERSONA_IMAGE_SRC,
                          alt: PERSONA_IMAGE_ALT,
                        })
                      }
                    />
                  </div>
                </section>

                <section id="information-architecture" className={styles.caseSection}>
                <h3 className={styles.mainHeading}>Structuring the platform architecture</h3>
                <div className={styles.bodyStack}>
                  <p className={`body-2 ${styles.mainBody}`}>
                  We structured the information architecture by first separating the 
                  platform into distinct user roles, then mapping the features and 
                  workflows relevant to each role.
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
                    We mapped the wider user ecosystem first, then zoomed into the platform's
                    core service journey. This helped us understand the simultaneous interactions
                    between users, the platform, and supporting processes at each stage.
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

                  <div ref={registerIteration1BlockRef} className={styles.iterationVideoBlock}>
                    <div className={styles.finalScreenPhase}>
                      <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>
                        Flow 1: Enroll Subscription
                      </p>
                      <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                        The initial flow that we had designed required less clicks, but it made the
                        process more complex. The main problem was that the process did not feel
                        guided.
                      </p>
                    </div>

                    <div
                      ref={iteration1CarouselTrigger.setRoot}
                      className={styles.iteration1Carousel}
                    >
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
                                  width={1080}
                                  height={708}
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
                        slideCount={ITERATION1_SLIDES.length}
                        activeIndex={iteration1Carousel.activeIndex}
                        progressKey={iteration1Carousel.progressKey}
                        ariaLabel="Enroll subscription iteration 1 navigation"
                        advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                        showProgressLoader={iteration1CarouselTrigger.isActive}
                        onGoTo={iteration1Carousel.goTo}
                        onPrevious={iteration1Carousel.goToPrevious}
                        onNext={iteration1Carousel.goToNext}
                      />
                    </div>

                    <div className={styles.finalScreensCarousel}>
                      <div className={styles.finalScreenFrame}>
                        <CaseStudyVideoPlayer
                          src={ENROLL_SUBSCRIPTION_VIDEO_SRC}
                          ariaLabel="The final flow for a business enrolling in subscriptions"
                          onVideoRef={(element) => {
                            iteration1VideoRef.current = element
                          }}
                        />
                        <p className={`body-2 ${styles.finalScreenCaption}`}>
                          The final flow for a business enrolling in subscriptions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    ref={registerIteration2BlockRef}
                    className={`${styles.iterationVideoBlock} ${styles.finalScreenBlockRepeat}`}
                  >
                    <div className={styles.finalScreenPhase}>
                      <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>
                        Flow 2: Submit Request
                      </p>
                      <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                        The point where the iteration lacked was scalibility. While it was nice to
                        have the user select category and sub-category in one go. As categories
                        scaled, this would cause a problem
                      </p>
                    </div>

                    <div
                      ref={iteration2CarouselTrigger.setRoot}
                      className={styles.iteration1Carousel}
                    >
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
                                  width={1080}
                                  height={708}
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
                        slideCount={ITERATION2_SLIDES.length}
                        activeIndex={iteration2Carousel.activeIndex}
                        progressKey={iteration2Carousel.progressKey}
                        ariaLabel="Submit request iteration 2 navigation"
                        advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                        showProgressLoader={iteration2CarouselTrigger.isActive}
                        onGoTo={iteration2Carousel.goTo}
                        onPrevious={iteration2Carousel.goToPrevious}
                        onNext={iteration2Carousel.goToNext}
                      />
                    </div>

                    <div className={styles.finalScreensCarousel}>
                      <div className={styles.finalScreenFrame}>
                        <CaseStudyVideoPlayer
                          src={SUBMIT_REQUEST_VIDEO_SRC}
                          ariaLabel="The final flow for a user to create and submit a request"
                          onVideoRef={(element) => {
                            iteration2VideoRef.current = element
                          }}
                        />
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

                  <div
                    ref={registerFinalScreenBlockRef}
                    className={styles.finalScreenBlock}
                  >
                    <div className={styles.finalScreensCarousel}>
                      <div className={styles.caseCarouselViewport}>
                        <div
                          ref={finalScreensCarousel.trackRef}
                          className={styles.caseCarouselTrack}
                          data-loop={finalScreensCarousel.loopEnabled ? 'true' : 'false'}
                          aria-label="Final screen demonstrations"
                        >
                          {getLoopSlideEntries(FINAL_SCREEN_SLIDES).map((entry, domIndex) => {
                            const slideIndex = entry.logicalIndex

                            return (
                              <div
                                key={entry.key}
                                ref={(element) =>
                                  finalScreensCarousel.registerSlideRef(domIndex, element)
                                }
                                className={styles.caseCarouselSlide}
                                aria-hidden={entry.isClone ? true : undefined}
                              >
                                <div className={styles.finalScreenFrame}>
                                  <CaseStudyVideoPlayer
                                    src={entry.item.src}
                                    ariaLabel={entry.item.caption}
                                    onVideoRef={
                                      entry.isClone || slideIndex === null
                                        ? undefined
                                        : (element) =>
                                            registerFinalScreenVideoRef(slideIndex, element)
                                    }
                                  />
                                  <p className={`body-2 ${styles.finalScreenCaption}`}>
                                    {entry.item.caption}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <CaseCarouselControls
                        slideCount={FINAL_SCREEN_SLIDES.length}
                        activeIndex={finalScreensCarousel.activeIndex}
                        progressKey={finalScreensCarousel.progressKey}
                        ariaLabel="Final screen navigation"
                        advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                        showProgressLoader={false}
                        onGoTo={finalScreensCarousel.goTo}
                        onPrevious={finalScreensCarousel.goToPrevious}
                        onNext={finalScreensCarousel.goToNext}
                      />
                    </div>
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

                <section id="learnings" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>What I learnt</h3>
                  <div className={styles.bodyStack}>
                    <ul className={styles.learningsList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                      With multiple roles interacting with one another, understanding who does what,
                      when, and why became the foundation for the design. I spent significant time
                      mapping roles, relationships, and dependencies before moving into individual
                      experiences.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                      Service blueprints, information architecture, and ecosystem maps weren&apos;t
                      always easy for clients to interpret as UX artefacts. But they helped us turn
                      complex discussions into concrete decisions, uncover friction points, and create
                      a shared reference point for collaboration.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                      PPN taught me to think beyond the end user. Admins and local representatives
                      were also users of the product, and their ability to manage the ecosystem
                      directly affected the experience of everyone else. Designing their workflows
                      was therefore just as important as designing the customer journey.
                      </li>
                    </ul>
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
