import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { protectedVideoProps } from '../../utils/videoProtection'
import styles from './CaseStudyVideoPlayer.module.css'

const VIDEO_IN_VIEW_RATIO_ON = 0.35
const VIDEO_IN_VIEW_RATIO_OFF = 0.12
const VIDEO_IN_VIEW_THRESHOLDS = [0, VIDEO_IN_VIEW_RATIO_OFF, VIDEO_IN_VIEW_RATIO_ON, 0.5, 0.75, 1]

type InitialPlayback = {
  currentTime: number
  playing: boolean
}

export type CaseStudyVideoPlayerProps = {
  src: string
  ariaLabel: string
  onVideoRef?: (element: HTMLVideoElement | null) => void
  autoPlay?: boolean
  autoPlayWhenVisible?: boolean
  loop?: boolean
  clickToZoom?: boolean
  initialPlayback?: InitialPlayback | null
  className?: string
}

export function CaseStudyVideoPlayer({
  src,
  ariaLabel,
  onVideoRef,
  autoPlay = false,
  autoPlayWhenVisible = false,
  loop = false,
  clickToZoom = false,
  initialPlayback = null,
  className,
}: CaseStudyVideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const detachVideoEventsRef = useRef<(() => void) | null>(null)
  const userPausedRef = useRef(false)
  const appliedInitialPlaybackRef = useRef(false)
  const [isInView, setIsInView] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPlayback, setZoomPlayback] = useState<InitialPlayback | null>(null)
  const zoomVideoRef = useRef<HTMLVideoElement | null>(null)

  const syncPlaybackState = useCallback((video: HTMLVideoElement) => {
    setIsPlaying(!video.paused && !video.ended)
    setIsEnded(video.ended)
    setCurrentTime(video.currentTime)
    setDuration(video.duration || 0)
  }, [])

  const assignVideoRef = useCallback(
    (element: HTMLVideoElement | null) => {
      detachVideoEventsRef.current?.()
      detachVideoEventsRef.current = null
      videoRef.current = element
      onVideoRef?.(element)

      if (!element) return

      const handlePlaying = () => {
        setIsPlaying(true)
        setIsEnded(false)
      }
      const handlePause = () => setIsPlaying(false)
      const handleEnded = () => {
        setIsPlaying(false)
        setIsEnded(true)
      }
      const handleTimeUpdate = () => {
        setCurrentTime(element.currentTime)
        setIsPlaying(!element.paused && !element.ended)
      }
      const handleLoadedMetadata = () => setDuration(element.duration || 0)
      const handleDurationChange = () => setDuration(element.duration || 0)

      element.addEventListener('playing', handlePlaying)
      element.addEventListener('pause', handlePause)
      element.addEventListener('ended', handleEnded)
      element.addEventListener('timeupdate', handleTimeUpdate)
      element.addEventListener('loadedmetadata', handleLoadedMetadata)
      element.addEventListener('durationchange', handleDurationChange)
      syncPlaybackState(element)

      detachVideoEventsRef.current = () => {
        element.removeEventListener('playing', handlePlaying)
        element.removeEventListener('pause', handlePause)
        element.removeEventListener('ended', handleEnded)
        element.removeEventListener('timeupdate', handleTimeUpdate)
        element.removeEventListener('loadedmetadata', handleLoadedMetadata)
        element.removeEventListener('durationchange', handleDurationChange)
      }
    },
    [onVideoRef, syncPlaybackState]
  )

  useEffect(() => {
    userPausedRef.current = false
    setIsPlaying(false)
    setIsEnded(false)
    setCurrentTime(0)
    setDuration(0)
    appliedInitialPlaybackRef.current = false
  }, [src])

  useEffect(
    () => () => {
      detachVideoEventsRef.current?.()
      detachVideoEventsRef.current = null
    },
    []
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
  }, [src])

  useEffect(() => {
    if (!initialPlayback || appliedInitialPlaybackRef.current) return

    const video = videoRef.current
    if (!video) return

    const apply = () => {
      if (appliedInitialPlaybackRef.current) return
      appliedInitialPlaybackRef.current = true
      video.currentTime = initialPlayback.currentTime
      if (initialPlayback.playing) {
        void video.play().catch(() => {})
      }
    }

    if (video.readyState >= 1) {
      apply()
      return
    }

    video.addEventListener('loadedmetadata', apply, { once: true })
    return () => video.removeEventListener('loadedmetadata', apply)
  }, [initialPlayback, src])

  useEffect(() => {
    if (!autoPlay) return

    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      void video.play().catch(() => {})
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    return () => video.removeEventListener('loadeddata', tryPlay)
  }, [autoPlay, src])

  useEffect(() => {
    if (!autoPlayWhenVisible) {
      setIsInView(false)
      return
    }

    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0
        setIsInView((wasVisible) => {
          if (!wasVisible && ratio >= VIDEO_IN_VIEW_RATIO_ON) {
            return true
          }
          if (wasVisible && ratio < VIDEO_IN_VIEW_RATIO_OFF) {
            return false
          }
          return wasVisible
        })
      },
      { threshold: VIDEO_IN_VIEW_THRESHOLDS }
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [autoPlayWhenVisible, src])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isZoomed) return

    const shouldAutoPlay = autoPlay || (autoPlayWhenVisible && isInView)

    if (shouldAutoPlay) {
      if (!userPausedRef.current && video.paused) {
        void video.play().catch(() => {})
      }
      return
    }

    if (!video.paused) {
      video.pause()
    }
  }, [autoPlay, autoPlayWhenVisible, isInView, isZoomed, src])

  const closeZoom = useCallback(() => {
    const inlineVideo = videoRef.current
    const expandedVideo = zoomVideoRef.current

    if (inlineVideo && expandedVideo) {
      inlineVideo.currentTime = expandedVideo.currentTime
      if (!expandedVideo.paused && !expandedVideo.ended) {
        userPausedRef.current = false
        void inlineVideo.play().catch(() => {})
      }
    }

    zoomVideoRef.current = null
    setIsZoomed(false)
    setZoomPlayback(null)
  }, [])

  useEffect(() => {
    if (!isZoomed) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeZoom()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeZoom, isZoomed])

  const openZoom = useCallback(() => {
    const video = videoRef.current
    const playback: InitialPlayback = {
      currentTime: video?.currentTime ?? 0,
      playing: Boolean(video && !video.paused && !video.ended),
    }
    video?.pause()
    setZoomPlayback(playback)
    setIsZoomed(true)
  }, [])

  const handleTogglePlayback = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const video = videoRef.current
    if (!video) return

    if (isEnded || video.ended) {
      video.currentTime = 0
      setIsEnded(false)
      userPausedRef.current = false
      setIsPlaying(true)
      void video.play().catch(() => {})
      return
    }

    if (video.paused) {
      userPausedRef.current = false
      setIsPlaying(true)
      void video.play().catch(() => {})
      return
    }

    userPausedRef.current = true
    video.pause()
    setIsPlaying(false)
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    const video = videoRef.current
    if (!video) return

    const nextTime = Number(event.target.value)
    video.currentTime = nextTime
    setCurrentTime(nextTime)
    if (isEnded && nextTime < duration) {
      setIsEnded(false)
    }
  }

  const handleVideoClick = (event: ReactMouseEvent<HTMLVideoElement>) => {
    if (!clickToZoom || initialPlayback) return
    event.stopPropagation()
    openZoom()
  }

  const playbackLabel = isEnded ? 'Replay video' : isPlaying ? 'Pause video' : 'Play video'

  const player = (
    <div
      ref={rootRef}
      key={src}
      className={`caseStudyVideo ${styles.root}${clickToZoom ? ` ${styles.rootClickZoom}` : ''}${className ? ` ${className}` : ''}`}
    >
      <video
        key={src}
        ref={assignVideoRef}
        src={src}
        className={`caseStudyVideoMedia ${styles.media}`}
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        loop={loop}
        onClick={clickToZoom ? handleVideoClick : undefined}
        {...protectedVideoProps}
      />
      <div
        className={`caseStudyVideoControls ${styles.controls}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={`caseStudyVideoButton ${styles.button}`}
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
          className={`caseStudyVideoTimeline ${styles.timeline}`}
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
        {clickToZoom && !initialPlayback ? (
          <button
            type="button"
            className={`caseStudyVideoButton ${styles.button}`}
            aria-label="Expand video"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              openZoom()
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6.5 2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V6.5M9.5 2.5H12.5C13.0523 2.5 13.5 2.94772 13.5 3.5V6.5M9.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V9.5M6.5 13.5H3.5C2.94772 13.5 2.5 13.0523 2.5 12.5V9.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )

  return (
    <>
      {player}
      {!initialPlayback && isZoomed && zoomPlayback
        ? createPortal(
            <div
              className={styles.zoomLightbox}
              role="dialog"
              aria-modal="true"
              aria-label="Video full screen view"
              onClick={closeZoom}
            >
              <button
                type="button"
                className={styles.zoomClose}
                aria-label="Close full screen view"
                onClick={closeZoom}
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
              <div className={styles.zoomPanel} onClick={(event) => event.stopPropagation()}>
                <CaseStudyVideoPlayer
                  src={src}
                  ariaLabel={ariaLabel}
                  initialPlayback={zoomPlayback}
                  onVideoRef={(element) => {
                    zoomVideoRef.current = element
                  }}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
