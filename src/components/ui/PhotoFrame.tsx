import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import styles from './PhotoFrame.module.css'

type PhotoFrameProps = {
  /** Image displayed inside the frame (replaceable later with a video). */
  src: string
  alt: string
  /** Optional overlay (e.g. a <video> revealed on hover) rendered above
   *  the still image inside the same rounded photo slot. */
  hoverContent?: ReactNode
}

/**
 * PhotoFrame
 * The tilted white "browser window" frame from the design — drawn entirely
 * with inline SVG so the photo slot is empty by default and any HTML
 * content (image now, video later) can be layered into it via props.
 *
 * Coordinate system: viewBox 669×846. The card itself is 503×564,
 * rotated 5.71082° around its top-left corner. The photo slot inside
 * the card is 475×514, rotated the same amount around (96.582, 48.3251).
 * The overlay <img> uses those numbers as percentages so it lines up
 * with the SVG slot at any size.
 */
export function PhotoFrame({ src, alt, hoverContent }: PhotoFrameProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isHoveringRef = useRef(false)
  const hoverSessionRef = useRef(0)
  const [isVideoActive, setIsVideoActive] = useState(false)

  const setFrameRef = (node: HTMLDivElement | null) => {
    videoRef.current = node?.querySelector('video') ?? null
  }

  const waitForFirstRenderedFrame = async (video: HTMLVideoElement) => {
    if ('requestVideoFrameCallback' in video) {
      await new Promise<void>((resolve) => {
        ;(
          video as HTMLVideoElement & {
            requestVideoFrameCallback: (cb: () => void) => number
          }
        ).requestVideoFrameCallback(() => resolve())
      })
      return
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })
  }

  const handleMouseEnter = () => {
    isHoveringRef.current = true
    const hoverSession = ++hoverSessionRef.current

    const video = videoRef.current
    if (!video) return

    const startVideo = async () => {
      setIsVideoActive(false)

      video.pause()
      video.currentTime = 0

      try {
        await video.play()
      } catch {
        // Ignore autoplay interruptions; the still image remains visible.
        return
      }

      if (!isHoveringRef.current || hoverSession !== hoverSessionRef.current) return

      await waitForFirstRenderedFrame(video)
      if (!isHoveringRef.current || hoverSession !== hoverSessionRef.current) return

      setIsVideoActive(true)
    }

    void startVideo()
  }

  const handleMouseLeave = () => {
    isHoveringRef.current = false
    hoverSessionRef.current += 1
    setIsVideoActive(false)

    const video = videoRef.current
    if (!video) return

    // Hide first, then reset on the next frame to avoid a visible flash.
    requestAnimationFrame(() => {
      video.pause()
      video.currentTime = 0
    })
  }

  return (
    <div
      ref={setFrameRef}
      className={`${styles.frame} ${isVideoActive ? styles.videoActive : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 669 846"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g filter="url(#photo-frame-shadow)">
          {/* White card */}
          <rect
            x="86.2344"
            y="11.1106"
            width="503"
            height="564"
            rx="20"
            transform="rotate(5.71082 86.2344 11.1106)"
            fill="white"
          />
          {/* Inner 1px border */}
          <rect
            x="86.6821"
            y="11.6579"
            width="502"
            height="563"
            rx="19.5"
            transform="rotate(5.71082 86.6821 11.6579)"
            stroke="#DFDFDF"
            fill="none"
          />
          {/* Traffic-light dots — red / gray / green */}
          <circle
            cx="103.251"
            cy="31.9069"
            r="5"
            transform="rotate(5.71082 103.251 31.9069)"
            fill="#FC2B29"
          />
          <circle
            cx="119.173"
            cy="33.4991"
            r="5"
            transform="rotate(5.71082 119.173 33.4991)"
            fill="#ABA9A9"
          />
          <circle
            cx="135.091"
            cy="35.0911"
            r="5"
            transform="rotate(5.71082 135.091 35.0911)"
            fill="#6BD442"
          />
          {/* Photo slot — neutral fill so the area reads as a placeholder
              if no image is supplied. The actual content is layered above
              via the .imageSlot overlay. */}
          <rect
            x="96.582"
            y="48.3251"
            width="475"
            height="514"
            rx="18"
            transform="rotate(5.71082 96.582 48.3251)"
            fill="#F2F2F2"
          />
        </g>
        <defs>
          {/* The four-layer drop shadow from the original Figma export.
              Stacked offsets + soft blurs give the depth the design wants. */}
          <filter
            id="photo-frame-shadow"
            x="-1.88672"
            y="-1.8894"
            width="695.625"
            height="849.253"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="3" dy="10" />
            <feGaussianBlur stdDeviation="11.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="10" dy="40" />
            <feGaussianBlur stdDeviation="20.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow"
              result="effect2_dropShadow"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="23" dy="89" />
            <feGaussianBlur stdDeviation="27.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow"
              result="effect3_dropShadow"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="41" dy="159" />
            <feGaussianBlur stdDeviation="33" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
            />
            <feBlend
              mode="normal"
              in2="effect3_dropShadow"
              result="effect4_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect4_dropShadow"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      {/* HTML content layered over the photo slot. Uses the same rotation
          and rounded corners as the SVG rect so they line up exactly. */}
      <div className={styles.imageSlot}>
        <img src={src} alt={alt} className={styles.image} />
        {hoverContent && (
          <div className={styles.hoverContent}>{hoverContent}</div>
        )}
      </div>
    </div>
  )
}
