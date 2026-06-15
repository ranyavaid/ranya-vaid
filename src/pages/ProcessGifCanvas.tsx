import { useCallback, useEffect, useRef } from 'react'
import { decompressFrames, parseGIF, type ParsedFrame } from 'gifuct-js'

type ScrollGifCanvasProps = {
  src: string
  shouldPlay: boolean
  ariaLabel: string
  className?: string
  loop?: boolean
}

type GifFrame = ParsedFrame

export function ScrollGifCanvas({
  src,
  shouldPlay,
  ariaLabel,
  className,
  loop = false,
}: ScrollGifCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<GifFrame[]>([])
  const gifSizeRef = useRef({ width: 0, height: 0 })
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const compositingCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameImageDataRef = useRef<ImageData | null>(null)
  const timerRef = useRef<number | null>(null)
  const gifReadyRef = useRef(false)
  const hasFinishedRef = useRef(false)
  const playingRef = useRef(false)
  const shouldPlayRef = useRef(shouldPlay)
  const loopRef = useRef(loop)

  shouldPlayRef.current = shouldPlay
  loopRef.current = loop

  const blitToDisplay = useCallback(() => {
    const canvas = canvasRef.current
    const compositingCanvas = compositingCanvasRef.current
    if (!canvas || !compositingCanvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(compositingCanvas, 0, 0)
  }, [])

  const drawPatch = useCallback((frame: GifFrame) => {
    const tempCanvas = tempCanvasRef.current
    const compositingCanvas = compositingCanvasRef.current
    if (!tempCanvas || !compositingCanvas) return

    const tempCtx = tempCanvas.getContext('2d')
    const gifCtx = compositingCanvas.getContext('2d')
    if (!tempCtx || !gifCtx) return

    const { dims } = frame

    if (
      !frameImageDataRef.current ||
      dims.width !== frameImageDataRef.current.width ||
      dims.height !== frameImageDataRef.current.height
    ) {
      tempCanvas.width = dims.width
      tempCanvas.height = dims.height
      frameImageDataRef.current = tempCtx.createImageData(dims.width, dims.height)
    }

    frameImageDataRef.current.data.set(frame.patch)
    tempCtx.putImageData(frameImageDataRef.current, 0, 0)
    gifCtx.drawImage(tempCanvas, dims.left, dims.top)
  }, [])

  const renderFrameAt = useCallback(
    (index: number) => {
      const frames = framesRef.current
      const { width, height } = gifSizeRef.current
      const compositingCanvas = compositingCanvasRef.current
      if (!frames[index] || !compositingCanvas || width === 0) return

      const frame = frames[index]
      const gifCtx = compositingCanvas.getContext('2d')
      if (!gifCtx) return

      if (frame.disposalType === 2) {
        gifCtx.clearRect(0, 0, width, height)
      }

      drawPatch(frame)
      blitToDisplay()
    },
    [blitToDisplay, drawPatch]
  )

  const stopPlayback = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    playingRef.current = false
  }, [])

  const play = useCallback(() => {
    const frames = framesRef.current
    if (!frames.length || playingRef.current) return
    if (!loopRef.current && hasFinishedRef.current) return

    playingRef.current = true
    let frameIndex = 0

    const step = () => {
      renderFrameAt(frameIndex)

      const delay = Math.max(frames[frameIndex].delay || 10, 16)

      if (frameIndex >= frames.length - 1) {
        if (loopRef.current) {
          const { width, height } = gifSizeRef.current
          compositingCanvasRef.current?.getContext('2d')?.clearRect(0, 0, width, height)
          frameIndex = 0
          timerRef.current = window.setTimeout(step, delay)
          return
        }

        hasFinishedRef.current = true
        playingRef.current = false
        return
      }

      frameIndex += 1
      timerRef.current = window.setTimeout(step, delay)
    }

    step()
  }, [renderFrameAt])

  useEffect(() => {
    tempCanvasRef.current = document.createElement('canvas')
    compositingCanvasRef.current = document.createElement('canvas')

    let cancelled = false
    hasFinishedRef.current = false
    gifReadyRef.current = false

    fetch(src)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        if (cancelled) return

        const gif = parseGIF(buffer)
        const frames = decompressFrames(gif, true) as ParsedFrame[]
        const { width, height } = gif.lsd

        framesRef.current = frames
        gifSizeRef.current = { width, height }

        const canvas = canvasRef.current
        const compositingCanvas = compositingCanvasRef.current
        if (!canvas || !compositingCanvas) return

        canvas.width = width
        canvas.height = height
        compositingCanvas.width = width
        compositingCanvas.height = height

        gifReadyRef.current = true
        renderFrameAt(0)

        if (shouldPlayRef.current) {
          compositingCanvas.getContext('2d')?.clearRect(0, 0, width, height)
          play()
        }
      })
      .catch(() => {
        gifReadyRef.current = false
      })

    return () => {
      cancelled = true
      stopPlayback()
    }
  }, [src, renderFrameAt, stopPlayback, play])

  useEffect(() => {
    if (!shouldPlay || !gifReadyRef.current) return
    if (!loop && hasFinishedRef.current) return

    const compositingCanvas = compositingCanvasRef.current
    const { width, height } = gifSizeRef.current
    if (!compositingCanvas || width === 0) return

    compositingCanvas.getContext('2d')?.clearRect(0, 0, width, height)
    play()
  }, [shouldPlay, loop, play])

  useEffect(() => () => stopPlayback(), [stopPlayback])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={ariaLabel}
    />
  )
}
