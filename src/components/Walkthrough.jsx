import { useEffect, useLayoutEffect, useState } from 'react'

const CARD_WIDTH = 380
const GAP = 18
const SAFE_MARGIN = 16

/** Compute where to place the card + arrow given the target element rect. */
function computePlacement(rect) {
  if (!rect) return null
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Below if there's room, otherwise above.
  const spaceBelow = vh - rect.bottom
  const placeBelow = spaceBelow >= 240 || rect.top < 120

  const targetCenterX = rect.left + rect.width / 2
  let left = targetCenterX - CARD_WIDTH / 2
  left = Math.max(
    SAFE_MARGIN,
    Math.min(left, vw - CARD_WIDTH - SAFE_MARGIN),
  )

  const top = placeBelow ? rect.bottom + GAP : null
  const bottom = placeBelow ? null : vh - rect.top + GAP

  // Arrow horizontal position relative to the card (clamped to its width).
  const arrowLeft = Math.max(
    24,
    Math.min(targetCenterX - left, CARD_WIDTH - 24),
  )

  return { left, top, bottom, placement: placeBelow ? 'bottom' : 'top', arrowLeft }
}

export default function Walkthrough({ steps, onClose }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 600,
  )

  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= 600)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Highlight + scroll into view + track target rect for arrow positioning.
  useLayoutEffect(() => {
    if (!step?.target) {
      setTargetRect(null)
      return
    }
    const el = document.querySelector(step.target)
    if (!el) {
      setTargetRect(null)
      return
    }
    el.classList.add('walkthrough-target')

    const updateRect = () => {
      const r = el.getBoundingClientRect()
      setTargetRect({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        bottom: r.bottom,
        right: r.right,
      })
    }

    // Scroll into view, then re-measure after the smooth-scroll settles.
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    updateRect()
    const t1 = setTimeout(updateRect, 200)
    const t2 = setTimeout(updateRect, 500)

    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      el.classList.remove('walkthrough-target')
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [step])

  // ESC closes, arrow keys navigate
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose(true)
      if (e.key === 'ArrowRight')
        setStepIndex((i) => Math.min(steps.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setStepIndex((i) => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, steps.length])

  const next = () => {
    if (isLast) onClose(true)
    else setStepIndex((i) => i + 1)
  }
  const prev = () => setStepIndex((i) => Math.max(0, i - 1))

  // On mobile, always centre the card — popups next to tiny elements get awkward.
  const placement = !mobile && targetRect ? computePlacement(targetRect) : null

  const cardStyle = placement
    ? {
        position: 'fixed',
        left: `${placement.left}px`,
        ...(placement.top !== null && { top: `${placement.top}px` }),
        ...(placement.bottom !== null && { bottom: `${placement.bottom}px` }),
        width: `${CARD_WIDTH}px`,
      }
    : undefined

  return (
    <div
      className={`walkthrough${placement ? ' walkthrough--anchored' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site walkthrough"
    >
      <div className="walkthrough__backdrop" onClick={() => onClose(true)} />

      <div
        className={`walkthrough__card${placement ? ` walkthrough__card--${placement.placement}` : ''}`}
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {placement && (
          <span
            className="walkthrough__arrow"
            style={{ left: `${placement.arrowLeft}px` }}
            aria-hidden="true"
          />
        )}

        <span className="walkthrough__progress">
          Step {stepIndex + 1} of {steps.length}
        </span>

        <h2 className="walkthrough__title">{step.title}</h2>
        <p className="walkthrough__body">{step.body}</p>

        {step.tip ? <p className="walkthrough__tip">💡 {step.tip}</p> : null}

        <div className="walkthrough__dots" aria-hidden="true">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`walkthrough__dot${i === stepIndex ? ' walkthrough__dot--active' : ''}`}
              onClick={() => setStepIndex(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <div className="walkthrough__controls">
          <button
            type="button"
            className="walkthrough__skip"
            onClick={() => onClose(true)}
          >
            Skip tour
          </button>
          <div className="walkthrough__nav">
            {stepIndex > 0 && (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={prev}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={next}
            >
              {isLast ? "Let's go" : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
