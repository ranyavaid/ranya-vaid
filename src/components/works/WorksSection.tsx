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

const DRAG_THRESHOLD_PX = 8

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
  const [canScroll, setCanScroll] = useState(false)

  const updateScrollability = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    setCanScroll(scroller.scrollWidth > scroller.clientWidth + 1)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    updateScrollability()

    const onWheel = (event: WheelEvent) => {
      if (scroller.scrollWidth <= scroller.clientWidth + 1) return

      const { deltaX, deltaY } = event
      const isVerticalIntent = Math.abs(deltaY) > Math.abs(deltaX)

      if (isVerticalIntent) {
        event.preventDefault()
        window.scrollBy({ top: deltaY, left: 0 })
        return
      }

      if (Math.abs(deltaX) > 0) {
        event.preventDefault()
        scroller.scrollLeft += deltaX
      }
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })

    const resizeObserver = new ResizeObserver(updateScrollability)
    resizeObserver.observe(scroller)

    return () => {
      scroller.removeEventListener('wheel', onWheel)
      resizeObserver.disconnect()
    }
  }, [updateScrollability])

  const onPointerDownCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canScroll) return
      if (event.pointerType === 'mouse' && event.button !== 0) return

      const scroller = scrollerRef.current
      if (!scroller) return

      dragState.current = {
        active: true,
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
        startScrollLeft: scroller.scrollLeft,
        pointerId: event.pointerId,
      }
    },
    [canScroll]
  )

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
  }, [])

  const onClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.moved) return

    event.preventDefault()
    event.stopPropagation()
    dragState.current.moved = false
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

      <div
        ref={scrollerRef}
        className={`${styles.notebooksScroller} ${
          canScroll ? styles.notebooksScrollerScrollable : styles.notebooksScrollerStatic
        }`}
        aria-label="Featured case folders"
        onPointerDownCapture={onPointerDownCapture}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div className={styles.notebooksTrack}>
          {FEATURED_CASES.map((workCase) => (
            <div key={workCase.id} className={styles.notebookItem}>
              <Notebook {...workCase} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
