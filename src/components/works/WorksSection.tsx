import { useCallback, useEffect, useRef, useState } from 'react'
import { Notebook } from './Notebook'
import { FEATURED_CASES } from './worksData'
import styles from './WorksSection.module.css'

type DragState = {
  active: boolean
  moved: boolean
  startX: number
  startY: number
  startScrollLeft: number
  pointerId: number | null
}

type ScrollEdges = {
  overflow: boolean
  canScrollLeft: boolean
  canScrollRight: boolean
}

const DRAG_THRESHOLD_PX = 8

function getCarouselStep(scroller: HTMLDivElement) {
  const computed = getComputedStyle(scroller)
  const cardWidth = parseFloat(computed.getPropertyValue('--works-card-width'))
  const gap = parseFloat(computed.getPropertyValue('--works-card-gap'))
  return cardWidth + gap
}

/**
 * WorksSection
 * Featured case-study notebooks with project imagery and hover lift.
 */
export function WorksSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<DragState>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    pointerId: null,
  })
  const [scrollEdges, setScrollEdges] = useState<ScrollEdges>({
    overflow: false,
    canScrollLeft: false,
    canScrollRight: false,
  })

  const updateScrollEdges = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const overflow = scroller.scrollWidth > scroller.clientWidth + 1
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth

    setScrollEdges({
      overflow,
      canScrollLeft: overflow && scroller.scrollLeft > 1,
      canScrollRight: overflow && scroller.scrollLeft < maxScrollLeft - 1,
    })
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    updateScrollEdges()

    scroller.addEventListener('scroll', updateScrollEdges, { passive: true })

    const resizeObserver = new ResizeObserver(updateScrollEdges)
    resizeObserver.observe(scroller)

    return () => {
      scroller.removeEventListener('scroll', updateScrollEdges)
      resizeObserver.disconnect()
    }
  }, [updateScrollEdges])

  const onPointerDownCapture = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth + 1) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragState.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: scroller.scrollLeft,
      pointerId: event.pointerId,
    }
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    const drag = dragState.current
    if (!scroller || !drag.active || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (
      !drag.moved &&
      Math.abs(deltaY) > Math.abs(deltaX) &&
      Math.abs(deltaY) > DRAG_THRESHOLD_PX
    ) {
      dragState.current = {
        active: false,
        moved: false,
        startX: 0,
        startY: 0,
        startScrollLeft: 0,
        pointerId: null,
      }
      return
    }

    if (!drag.moved && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      drag.moved = true
      scroller.setPointerCapture(event.pointerId)
      scroller.classList.add(styles.notebooksScrollerDragging)
    }

    if (!drag.moved) return

    event.preventDefault()
    scroller.scrollLeft = drag.startScrollLeft - deltaX
  }, [])

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    const drag = dragState.current
    if (!scroller || !drag.active || drag.pointerId !== event.pointerId) return

    if (drag.moved && scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId)
    }

    scroller.classList.remove(styles.notebooksScrollerDragging)
    dragState.current = {
      active: false,
      moved: drag.moved,
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      pointerId: null,
    }

    updateScrollEdges()
  }, [updateScrollEdges])

  const onClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.moved) return

    event.preventDefault()
    event.stopPropagation()
    dragState.current.moved = false
  }, [])

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth + 1) return

    const target = event.target as Node
    if (!scroller.contains(target)) return

    const step = getCarouselStep(scroller)
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        scroller.scrollBy({ left: -step, behavior: 'smooth' })
        break
      case 'ArrowRight':
        event.preventDefault()
        scroller.scrollBy({ left: step, behavior: 'smooth' })
        break
      case 'Home':
        event.preventDefault()
        scroller.scrollTo({ left: 0, behavior: 'smooth' })
        break
      case 'End':
        event.preventDefault()
        scroller.scrollTo({ left: maxScrollLeft, behavior: 'smooth' })
        break
      default:
        break
    }
  }, [])

  return (
    <section id="works" className={styles.section} aria-labelledby="works-heading">
      <header className={styles.header}>
        <h2 id="works-heading" className={styles.heading}>
          Featured Cases
        </h2>
        <p className={`body-1 ${styles.subtext}`}>
          Over time, I’ve had the opportunity to work across a range of
          products and problem spaces. Here are a few projects I especially
          enjoyed building.
        </p>
      </header>

      <div className={styles.scrollerWrap}>
        {scrollEdges.overflow ? (
          <>
            <div
              className={`${styles.edgeFade} ${styles.edgeFadeLeft} ${
                scrollEdges.canScrollLeft ? '' : styles.edgeFadeHidden
              }`}
              aria-hidden="true"
            />
            <div
              className={`${styles.edgeFade} ${styles.edgeFadeRight} ${
                scrollEdges.canScrollRight ? '' : styles.edgeFadeHidden
              }`}
              aria-hidden="true"
            />
          </>
        ) : null}

        <div
          ref={scrollerRef}
          className={styles.notebooksScroller}
          role="region"
          aria-label="Featured case folders"
          onPointerDownCapture={onPointerDownCapture}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onKeyDown}
        >
          <div className={styles.notebooksTrack}>
            {FEATURED_CASES.map((workCase) => (
              <div key={workCase.id} className={styles.notebookItem}>
                <Notebook {...workCase} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
