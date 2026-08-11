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
import styles from './OrganizationalHierarchyCasePage.module.css'
import alignObjKrVersion from 'virtual:public-asset-version/okr Alignment/alignobj_kr.mp4'
import assignKrObjVersion from 'virtual:public-asset-version/okr Alignment/assignkr_obj.mp4'
import acceptObjVersion from 'virtual:public-asset-version/okr Alignment/accept_obj.mp4'
import editingVersion from 'virtual:public-asset-version/okr Alignment/editing.mp4'
import alignKrKrVersion from 'virtual:public-asset-version/okr Alignment/alignkr_kr.mp4'
import assignKrKrVersion from 'virtual:public-asset-version/okr Alignment/assignkr_kr.mp4'
import acceptKrVersion from 'virtual:public-asset-version/okr Alignment/accept_kr.mp4'
import bannerVersion from 'virtual:public-asset-version/okr Alignment/banner.mp4'

const IMPACT_CARDS = [
  {
    eyebrow: 'Adoption ',
    metric: '75%',
    body: 'of linked OKRs throughout the organization',
    color: '#FFCCF1',
  },
  {
    eyebrow: 'Efficiency',
    metric: '2 mins',
    body: 'average time  taken to create aligned OKRs',
    color: '#fff3b0',
  },
  {
    eyebrow: 'Business Impact',
    metric: '50%',
    body: 'reduction in managers reporting difficulty tracking progress',
    color: '#fff3b0',
  },
  {
    eyebrow: 'Leadership Impact',
    metric: '2x',
    body: 'faster identification of employee contributions to organizational goals.',
    color: '#b8e6ff',
  },
] as const

const RESEARCH_EXPLORE_TAGS = [
  'Current workarounds',
  'Persona-specific needs',
  'Existing challenges',
  'Critical goal connections',
  'Success factors',
] as const

const PRINCIPLE_CARDS = [
  {
    number: '01',
    title: 'Stay lightweight by default',
    body: 'Goal alignment is inherently complex. So, the interface had to be kept simple while ensuring the product remains lightweight and performant across different systems.',
    color: '#f2f2f2',
    numberBackground: '#b8e6ff',
    numberColor: '#0054F3',
    wide: false,
  },
  {
    number: '02',
    title: "Don't make users think in theory",
    body: "Most users don't think in terms of OKR frameworks. The experience should help them achieve their goals naturally, without requiring them to learn new concepts first.",
    color: '#f2f2f2',
    numberBackground: '#b8e6ff',
    numberColor: '#0054F3',
    wide: false,
  },
  {
    number: '03',
    title: 'Fit into existing workflows',
    body: 'As an addition to an existing platform, the feature had to feel familiar, integrate seamlessly, and require minimal behavior change.',
    color: '#f2f2f2',
    numberBackground: '#b8e6ff',
    numberColor: '#0054F3',
    wide: true,
  },
] as const

const PERSONA_CARDS = [
  {
    src: '/okr%20Alignment/user-persona-leadership.svg',
    alt: 'Leadership persona for CEOs, CXOs, Vice Presidents, and Directors',
  },
  {
    src: '/okr%20Alignment/user-persona-managers.svg',
    alt: 'Managers persona',
  },
  {
    src: '/okr%20Alignment/user-persona-employees.svg',
    alt: 'Employees persona',
  },
] as const

const DESIGN_OPTIONS = [
  {
    src: '/okr%20Alignment/option-1.png',
    alt: 'Design exploration option 1',
  },
  {
    src: '/okr%20Alignment/option-2.png',
    alt: 'Design exploration option 2',
  },
] as const

const ALIGNOBJ_KR_VIDEO_SRC = `/okr%20Alignment/alignobj_kr.mp4?v=${alignObjKrVersion}`
const ASSIGN_KR_OBJ_VIDEO_SRC = `/okr%20Alignment/assignkr_obj.mp4?v=${assignKrObjVersion}`
const ACCEPT_OBJ_VIDEO_SRC = `/okr%20Alignment/accept_obj.mp4?v=${acceptObjVersion}`
const EDITING_VIDEO_SRC = `/okr%20Alignment/editing.mp4?v=${editingVersion}`
const ALIGNKR_KR_VIDEO_SRC = `/okr%20Alignment/alignkr_kr.mp4?v=${alignKrKrVersion}`
const ASSIGNKR_KR_VIDEO_SRC = `/okr%20Alignment/assignkr_kr.mp4?v=${assignKrKrVersion}`
const ACCEPT_KR_VIDEO_SRC = `/okr%20Alignment/accept_kr.mp4?v=${acceptKrVersion}`
const BANNER_VIDEO_SRC = `/okr%20Alignment/banner.mp4?v=${bannerVersion}`

type FinalScreenSlide = {
  src: string
  caption: string
}

const FINAL_SCREEN_PHASE_1_SLIDES: FinalScreenSlide[] = [
  {
    src: ALIGNOBJ_KR_VIDEO_SRC,
    caption: 'Aligning an objective to its parent key result',
  },
  {
    src: ASSIGN_KR_OBJ_VIDEO_SRC,
    caption: 'Assign a key result as an objective',
  },
  {
    src: ACCEPT_OBJ_VIDEO_SRC,
    caption: 'Accepting an assigned objective',
  },
  {
    src: EDITING_VIDEO_SRC,
    caption: 'Editing an alignment',
  },
]

const FINAL_SCREEN_PHASE_2_SLIDES: FinalScreenSlide[] = [
  {
    src: ALIGNKR_KR_VIDEO_SRC,
    caption: 'Aligning a key result to its parent key result',
  },
  {
    src: ASSIGNKR_KR_VIDEO_SRC,
    caption: 'Assigning a key result as a key result to the product team',
  },
  {
    src: ACCEPT_KR_VIDEO_SRC,
    caption: 'Accepting an assigned key result',
  },
]

const FINAL_SCREEN_PHASES = [
  {
    id: 'phase-1',
    heading: 'Phase 1: Objective → Parent KR',
    body:
      'Phase 1 allowed users to understand how linking takes place. Initially, users could align their objectives to parent KR and assign KRs as an objective.',
    slides: FINAL_SCREEN_PHASE_1_SLIDES,
    carouselLabel: 'Phase 1 final screen demonstrations',
    controlsLabel: 'Phase 1 final screen navigation',
  },
  {
    id: 'phase-2',
    heading: 'Phase 2: Objective → Parent KR',
    body:
      'Phase 2 allowed users to understand how linking takes place. Initially, users could align their objectives to parent KR and assign KRs as an objective.',
    slides: FINAL_SCREEN_PHASE_2_SLIDES,
    carouselLabel: 'Phase 2 final screen demonstrations',
    controlsLabel: 'Phase 2 final screen navigation',
  },
] as const

const CAROUSEL_AUTO_ADVANCE_MS = 6000
const RESEARCH_IMAGE_SRC = '/okr%20Alignment/research.png'
const USER_FLOW_IMAGE_SRC = '/okr%20Alignment/user-flow.png'

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

const RULE_CARDS = [
  {
    eyebrow: 'How should progress dependency work?',
    body: 'Objectives always calculate progress from their own Key Results. Linked relationships improve alignment and visibility, but never become an alternative source of progress.',
    eyebrowBackground: '#FFCCF1',
    eyebrowColor: '#8A0064',
  },
  {
    eyebrow: 'How do we keep complex relationship chains understandable?',
    body: 'Rather than exposing every connected item at once, we used progressive disclosure so users explored one hierarchy level at a time.',
    eyebrowBackground: '#fff3b0',
    eyebrowColor: '#614B00',
  },
  {
    eyebrow: 'Can Key Results exist independently?',
    body: 'Following strict OKR methodology, every Key Result requires ownership. Whenever a Key Result was assigned independently, users either linked it to an existing Objective or created a new parent Objective during the flow.',
    eyebrowBackground: '#b8e6ff',
    eyebrowColor: '#0054F3',
  },
  {
    eyebrow: 'How do we prevent circular dependencies?',
    body: 'As relationships grew across teams, there was a risk of creating dependency loops where an item eventually depended on itself. Instead of validating only the new relationship, we validated the entire dependency chain before saving it.',
    eyebrowBackground: '#F9EECE',
    eyebrowColor: '#614B00',
  },
] as const

export function OrganizationalHierarchyCasePage() {
  const stateLayerFigureRef = useRef<HTMLDivElement | null>(null)
  const [stateLayerStarted, setStateLayerStarted] = useState(false)
  const foundationsFigureRef = useRef<HTMLDivElement | null>(null)
  const [foundationsStarted, setFoundationsStarted] = useState(false)
  const bannerVideoRef = useRef<HTMLVideoElement | null>(null)
  const finalScreenVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const finalScreenBlockObserversRef = useRef<Map<number, IntersectionObserver>>(new Map())
  const [finalScreenBlockVisible, setFinalScreenBlockVisible] = useState<boolean[]>(() =>
    FINAL_SCREEN_PHASES.map(() => false)
  )
  const researchGoalCardRef = useRef<HTMLElement | null>(null)
  const researchExploreCardRef = useRef<HTMLElement | null>(null)
  const [zoomedImage, setZoomedImage] = useState<ZoomedImage | null>(null)
  const rulesCarouselTrigger = useCarouselAutoAdvanceTrigger()
  const designCarouselTrigger = useCarouselAutoAdvanceTrigger()
  const rulesCarousel = useCaseCarousel(RULE_CARDS.length, CAROUSEL_AUTO_ADVANCE_MS, {
    isInView: rulesCarouselTrigger.isActive,
  })
  const designCarousel = useCaseCarousel(DESIGN_OPTIONS.length, CAROUSEL_AUTO_ADVANCE_MS, {
    isInView: designCarouselTrigger.isActive,
  })
  const finalScreensCarouselPhase1 = useCaseCarousel(FINAL_SCREEN_PHASE_1_SLIDES.length, 0, {
    autoAdvance: false,
  })
  const finalScreensCarouselPhase2 = useCaseCarousel(FINAL_SCREEN_PHASE_2_SLIDES.length, 0, {
    autoAdvance: false,
  })
  const finalScreensCarousels = [finalScreensCarouselPhase1, finalScreensCarouselPhase2]

  const registerFinalScreenBlockRef = useCallback((index: number, element: HTMLDivElement | null) => {
    const existingObserver = finalScreenBlockObserversRef.current.get(index)
    if (existingObserver) {
      existingObserver.disconnect()
      finalScreenBlockObserversRef.current.delete(index)
    }

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFinalScreenBlockVisible((previous) => {
          const isIntersecting = entry?.isIntersecting ?? false
          if (previous[index] === isIntersecting) return previous

          const next = [...previous]
          next[index] = isIntersecting
          return next
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(element)
    finalScreenBlockObserversRef.current.set(index, observer)
  }, [])

  const registerFinalScreenVideoRef = useCallback(
    (phaseIndex: number, slideIndex: number, element: HTMLVideoElement | null) => {
      const key = `${phaseIndex}-${slideIndex}`
      if (element) {
        finalScreenVideoRefs.current[key] = element
        return
      }

      delete finalScreenVideoRefs.current[key]
    },
    []
  )

  useEffect(
    () => () => {
      finalScreenBlockObserversRef.current.forEach((observer) => observer.disconnect())
      finalScreenBlockObserversRef.current.clear()
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
    FINAL_SCREEN_PHASES.forEach((phase, phaseIndex) => {
      const isBlockVisible = finalScreenBlockVisible[phaseIndex]
      const activeSlideIndex = finalScreensCarousels[phaseIndex]?.activeIndex ?? 0

      phase.slides.forEach((_, slideIndex) => {
        const video = finalScreenVideoRefs.current[`${phaseIndex}-${slideIndex}`]
        if (!video) return

        if (isBlockVisible && slideIndex === activeSlideIndex) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    })
  }, [
    finalScreenBlockVisible,
    finalScreensCarouselPhase1.activeIndex,
    finalScreensCarouselPhase2.activeIndex,
  ])

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
          Solving organization siloes through Goal Alignment for 2x faster contribution tracking
          </h2>
          <p className={`body-1 ${styles.body}`}>
          Joy of Performing (JOP) is an enterprise performance and goal management software designed to keep teams aligned and focused. To break down organizational siloes, I designed a core alignment feature to give companies a clear view of how different teams collaborate.
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
            aria-label="Goal alignment case study banner"
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
                    JOP is a performance and goal management platform built around Objectives & Key Results (OKRs). 
                    The platform helps organizations with employee engagement and progress tracking.
                    </p>
                    <p className={`body-2 ${styles.mainBody}`}>
                    When I joined, JOP already allowed teams to create Objectives and Key Results. 
                    However, those OKRs existed in isolation. Team goals had no structural connection 
                    to company objectives or cross-functional work, making it difficult to understand 
                    how individual efforts contributed to organizational outcomes. This feature request came 
                    directly from enterprise customers already using JOP at scale.

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
                      <p className={`body-2 ${styles.cardText}`}>1 Product Manager, 1 SME, 2 Developers, 1 QA</p>
                    </article>
                    <article className={styles.overviewCard}>
                      <p className={`body-3 ${styles.cardEyebrow}`}>Duration</p>
                      <p className={`body-2 ${styles.cardText}`}>2 month</p>
                    </article>
                  </div>
                </section>

                <section id="Research" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Research</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Before doing anything, I needed to understand OKR alignment as a framework 
                    to understand how alignment is supposed to work in any mature OKR practice 
                    even without a software in place. 
                    </p>
                  </div>
                  <div className={styles.researchFigure}>
                    <img
                      src={RESEARCH_IMAGE_SRC}
                      alt="OKR alignment research synthesis"
                      className={`${styles.researchImage} ${styles.figureZoomableImage}`}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: RESEARCH_IMAGE_SRC,
                          alt: 'OKR alignment research synthesis',
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View research image full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: RESEARCH_IMAGE_SRC,
                          alt: 'OKR alignment research synthesis',
                        })
                      }
                    />
                  </div>
                  <div className={`${styles.bodyStack} ${styles.researchFollowUp}`}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    The findings became the base for interviews conducted by the PM. 
                    Since there was no time allocated for a broad research push. 
                    We scoped down to  2 members from the leadership, 2 managers, and 2 employees.
                    </p>
                  </div>

                  <div className={styles.researchCards}>
                    <article
                      ref={researchGoalCardRef}
                      className={styles.researchGoalCard}
                    >
                      <p className={`body-2 ${styles.researchCardEyebrow}`}>
                        Research Goal:
                      </p>
                      <p className={`body-1 ${styles.researchGoalText}`}>
                        To uncover the challenges, workflows, and needs surrounding OKR
                        alignment across managers, employees, and leadership.
                      </p>
                    </article>

                    <article
                      ref={researchExploreCardRef}
                      className={styles.researchExploreCard}
                    >
                      <p className={`body-2 ${styles.researchCardEyebrow}`}>
                        Areas of exploration:
                      </p>
                      <div className={styles.researchExploreTags}>
                        {RESEARCH_EXPLORE_TAGS.map((tag) => (
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

                  <div className={`${styles.bodyStack} ${styles.researchSynthesisStack}`}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    I worked on synthesizing notes that helped shape the problem and the design.
                    </p>
                  </div>
                  <div className={styles.researchSynthesisFigure}>
                    <img
                      src="/okr%20Alignment/research-notes.svg"
                      alt="Research synthesis notes"
                      className={styles.researchSynthesisImage}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="Problem" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>The Actual Problem</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Customers initially requested goal linking. 
                    However, research showed that the request stemmed from a 
                    broader challenge.
                    </p>
                  </div>

                  <article className={styles.problemStatementCard}>
                    <p className={styles.problemStatementEyebrow}>Problem Statement</p>
                    <div className={styles.problemStatementInner}>
                      <p className={`body-2 ${styles.problemStatementBody}`}>
                        Organizations struggle to connect individual, team, and
                        organizational goals, making it difficult to coordinate
                        execution, understand progress, and recognize contribution.
                      </p>
                    </div>
                  </article>
                </section>

                <section id="user-personas" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Who we designed for
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    The problem affected not 1  but 3 different sets of users with 
                    different expectations and needs.
                    </p>
                  </div>
                  <div className={styles.userPersonaCards}>
                    {PERSONA_CARDS.map((persona) => (
                      <article key={persona.src} className={styles.userPersonaCard}>
                        <div className={styles.userPersonaCardFrame}>
                          <img
                            src={persona.src}
                            alt={persona.alt}
                            className={styles.userPersonaCardImage}
                            draggable={false}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="roll-out" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>How did we decide what to ship first?</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    While users wanted better alignment across teams, supporting 
                    every possible relationship from day one would have increased 
                    both implementation complexity and the learning curve. We mapped 
                    every possible connection and prioritized them based on user value, 
                    system complexity, and scalability.
                    </p>
                  </div>
                  <div className={styles.rolloutFigure}>
                    <img
                      src="/okr%20Alignment/rollout.svg"
                      alt="Phased rollout plan for OKR alignment feature"
                      className={styles.rolloutImage}
                      draggable={false}
                    />
                  </div>
                </section>

                <section id="rules" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Setting up rules</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Below are some of the other questions I asked 
                    that led to setting up key rules for  the feature
                    </p>
                  </div>

                  <div ref={rulesCarouselTrigger.setRoot} className={styles.rulesCarousel}>
                    <div className={styles.caseCarouselViewport}>
                      <div
                        ref={rulesCarousel.trackRef}
                        className={styles.caseCarouselTrack}
                        data-loop={rulesCarousel.loopEnabled ? 'true' : 'false'}
                        aria-label="Feature rules"
                      >
                      {getLoopSlideEntries(RULE_CARDS).map((entry, domIndex) => (
                        <div
                          key={entry.key}
                          ref={(element) => rulesCarousel.registerSlideRef(domIndex, element)}
                          className={styles.caseCarouselSlide}
                          aria-hidden={entry.isClone ? true : undefined}
                        >
                          <article className={styles.rulesCarouselCard}>
                            <span
                              className={`body-3 ${styles.rulesCardEyebrow}`}
                              style={{
                                backgroundColor: entry.item.eyebrowBackground,
                                color: entry.item.eyebrowColor,
                              }}
                            >
                              {entry.item.eyebrow}
                            </span>
                            <p className={`body-2 ${styles.rulesCardBody}`}>{entry.item.body}</p>
                          </article>
                        </div>
                      ))}
                      </div>
                    </div>

                    <CaseCarouselControls
                      slideCount={RULE_CARDS.length}
                      activeIndex={rulesCarousel.activeIndex}
                      progressKey={rulesCarousel.progressKey}
                      ariaLabel="Feature rules navigation"
                      advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                      showProgressLoader={rulesCarouselTrigger.isActive}
                      onGoTo={rulesCarousel.goTo}
                      onPrevious={rulesCarousel.goToPrevious}
                      onNext={rulesCarousel.goToNext}
                    />
                  </div>
                </section>

                <section id="user-flow" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>User Flow</h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    I chose to map the manager's journey because managers 
                    act as the bridge between organizational strategy and individual execution. 
                    </p>
                  </div>

                  <div className={styles.userFlowFigure}>
                    <img
                      src={USER_FLOW_IMAGE_SRC}
                      alt="Manager journey user flow for OKR alignment"
                      className={`${styles.userFlowImage} ${styles.figureZoomableImage}`}
                      width={818}
                      height={381}
                      draggable={false}
                      onClick={() =>
                        openZoomedImage({
                          src: USER_FLOW_IMAGE_SRC,
                          alt: 'Manager journey user flow for OKR alignment',
                        })
                      }
                    />
                    <FigureZoomButton
                      label="View user flow image full screen"
                      onClick={() =>
                        openZoomedImage({
                          src: USER_FLOW_IMAGE_SRC,
                          alt: 'Manager journey user flow for OKR alignment',
                        })
                      }
                    />
                  </div>
                </section>

                <section id="sketches" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Exploring the Design Space
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Before settling on the final interaction model, I 
                    explored multiple approaches. While each addressed 
                    the alignment problem, they introduced new usability 
                    challenges that ultimately shaped the design principles.
                    </p>
                  </div>

                  <div ref={designCarouselTrigger.setRoot} className={styles.designOptionsCarousel}>
                    <div className={styles.caseCarouselViewport}>
                      <div
                        ref={designCarousel.trackRef}
                        className={styles.caseCarouselTrack}
                        data-loop={designCarousel.loopEnabled ? 'true' : 'false'}
                        aria-label="Design exploration options"
                      >
                      {getLoopSlideEntries(DESIGN_OPTIONS).map((entry, domIndex) => (
                        <div
                          key={entry.key}
                          ref={(element) => designCarousel.registerSlideRef(domIndex, element)}
                          className={styles.caseCarouselSlide}
                          aria-hidden={entry.isClone ? true : undefined}
                        >
                          <div className={styles.designOptionFigure}>
                            <img
                              src={entry.item.src}
                              alt={entry.item.alt}
                              className={`${styles.designOptionImage} ${styles.figureZoomableImage}`}
                              width={818}
                              height={524}
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
                      slideCount={DESIGN_OPTIONS.length}
                      activeIndex={designCarousel.activeIndex}
                      progressKey={designCarousel.progressKey}
                      ariaLabel="Design exploration navigation"
                      advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                      showProgressLoader={designCarouselTrigger.isActive}
                      onGoTo={designCarousel.goTo}
                      onPrevious={designCarousel.goToPrevious}
                      onNext={designCarousel.goToNext}
                    />
                  </div>
                </section>

                <section id="principles" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>Principles
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Three rules every screen would be based on:
                    </p>
                  </div>

                  <div className={styles.principleCards}>
                    {PRINCIPLE_CARDS.map((card) => (
                      <article
                        key={card.number}
                        className={`${styles.principleCard} ${card.wide ? styles.principleCardWide : ''}`}
                        style={{ backgroundColor: card.color }}
                      >
                        <span
                          className={`body-2 ${styles.principleCardNumber}`}
                          style={{
                            backgroundColor: card.numberBackground,
                            color: card.numberColor,
                          }}
                        >
                          {card.number}
                        </span>
                        <h4 className={styles.principleCardTitle}>{card.title}</h4>
                        <p className={styles.principleCardBody}>{card.body}</p>
                      </article>
                    ))}
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

                  {FINAL_SCREEN_PHASES.map((phase, phaseIndex) => {
                    const carousel = finalScreensCarousels[phaseIndex]

                    return (
                      <div
                        key={phase.id}
                        ref={(element) => registerFinalScreenBlockRef(phaseIndex, element)}
                        className={`${styles.finalScreenBlock} ${
                          phaseIndex > 0 ? styles.finalScreenBlockRepeat : ''
                        }`}
                      >
                        <div className={styles.finalScreenPhase}>
                          <p className={`body-1 ${styles.finalScreenPhaseHeading}`}>
                            {phase.heading}
                          </p>
                          <p className={`body-2 ${styles.finalScreenPhaseBody}`}>
                            {phase.body}
                          </p>
                        </div>

                        <div className={styles.finalScreensCarousel}>
                          <div className={styles.caseCarouselViewport}>
                            <div
                              ref={carousel.trackRef}
                              className={styles.caseCarouselTrack}
                              data-loop={carousel.loopEnabled ? 'true' : 'false'}
                              aria-label={phase.carouselLabel}
                            >
                            {getLoopSlideEntries(phase.slides).map((entry, domIndex) => {
                              const slideIndex = entry.logicalIndex

                              return (
                              <div
                                key={`${phase.id}-${entry.key}`}
                                ref={(element) => carousel.registerSlideRef(domIndex, element)}
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
                                            registerFinalScreenVideoRef(
                                              phaseIndex,
                                              slideIndex,
                                              element
                                            )
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
                            slideCount={phase.slides.length}
                            activeIndex={carousel.activeIndex}
                            progressKey={carousel.progressKey}
                            ariaLabel={phase.controlsLabel}
                            advanceDurationMs={CAROUSEL_AUTO_ADVANCE_MS}
                            showProgressLoader={false}
                            onGoTo={carousel.goTo}
                            onPrevious={carousel.goToPrevious}
                            onNext={carousel.goToNext}
                          />
                        </div>
                      </div>
                    )
                  })}
                </section>

                <section id="impact" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>
                  What the feature changed
                  </h3>
                  <div className={styles.bodyStack}>
                    <p className={`body-2 ${styles.mainBody}`}>
                    Here is what we were able to achieve within 3 months of 
                    goal alignment's full rollout:
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
                        <div className={styles.impactCardSpacer} aria-hidden="true" />
                        <div className={styles.impactCardContent}>
                          <p className={`h2 ${styles.impactCardMetric}`}>
                            {card.metric}
                          </p>
                          <p className={`body-2 ${styles.impactCardBody}`}>
                            {card.body}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="learnings" className={styles.caseSection}>
                  <h3 className={styles.mainHeading}>What I learnt</h3>
                  <div className={styles.bodyStack}>
                    <ul className={styles.learningsList}>
                      <li className={`body-2 ${styles.mainBody}`}>
                      Working in a live product means users already have 
                      established mental models. New features should build 
                      on those behaviors rather than asking users to relearn the whole product.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                      Strong interfaces take from strong systems. Defining the 
                      underlying relationships and logic first made the UI simpler 
                      and easier to scale.
                      </li>
                      <li className={`body-2 ${styles.mainBody}`}>
                      Early exploration is about learning, not validating. 
                      The concepts we discarded were just as valuable because 
                      they revealed the principles that shaped the final solution.
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
