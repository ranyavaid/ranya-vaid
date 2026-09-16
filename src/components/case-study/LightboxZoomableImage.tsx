import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import styles from './LightboxZoomableImage.module.css'

export type LightboxZoomState = {
  isExpanded: boolean
  zoomOut: () => void
}

type LightboxZoomableImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  enabled?: boolean
  resetKey?: string | number
  layout?: 'default' | 'carousel'
  onZoomStateChange?: (state: LightboxZoomState) => void
}

export function LightboxZoomableImage({
  src,
  alt,
  width,
  height,
  enabled = true,
  resetKey,
  layout = 'default',
  onZoomStateChange,
}: LightboxZoomableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragOriginRef = useRef({ pointerX: 0, pointerY: 0, panX: 0, panY: 0 })
  const suppressClickRef = useRef(false)

  const zoomOut = useCallback(() => {
    setIsExpanded(false)
    setPan({ x: 0, y: 0 })
    setIsDragging(false)
  }, [])

  const zoomIn = useCallback(() => {
    setIsExpanded(true)
    setPan({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    setIsExpanded(false)
    setPan({ x: 0, y: 0 })
    setIsDragging(false)
    suppressClickRef.current = false
  }, [src, resetKey])

  useEffect(() => {
    onZoomStateChange?.({ isExpanded, zoomOut })
  }, [isExpanded, onZoomStateChange, zoomOut])

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

  if (!enabled) {
    return (
      <img
        src={src}
        alt={alt}
        className={layout === 'carousel' ? styles.imageCarouselFit : styles.image}
        width={width}
        height={height}
        draggable={false}
      />
    )
  }

  const isCarousel = layout === 'carousel'

  return (
    <div
      ref={stageRef}
      className={`${styles.stage} ${
        isExpanded
          ? `${styles.stageExpanded} ${isCarousel ? styles.stageExpandedCarousel : ''}`
          : styles.stageFit
      } ${isDragging ? styles.stageDragging : ''}`}
      onClick={handleStageClick}
      onDoubleClick={handleStageDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`${styles.image} ${isCarousel && !isExpanded ? styles.imageCarouselFit : ''} ${
          isExpanded ? styles.imageExpanded : ''
        }`}
        width={width}
        height={height}
        draggable={false}
        onLoad={handleImageLoad}
        style={
          isExpanded
            ? ({
                '--lightbox-pan-x': `${pan.x}px`,
                '--lightbox-pan-y': `${pan.y}px`,
              } as CSSProperties)
            : undefined
        }
      />
    </div>
  )
}
