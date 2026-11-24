import { useEffect, useRef } from 'react'
import type { Step } from '../logic/solve'
import type { Dictionary } from '../dictionary'

type Props = {
  board: number[]
  result: Step[]
  count: number
  text: Dictionary
}

export function PlacementSteps({ board, result, count, text }: Props) {
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    section.current?.focus({ preventScroll: true })
    section.current?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }, [result])
  return (
    <section
      ref={section}
      tabIndex={-1}
      className="results"
      aria-label={text.results}
      aria-live="polite"
    >
      <h2>{text.results}</h2>
      {result.length < count && (
        <div className="notice">
          <strong>{text.noSpace}</strong>
          <p>{result.length ? text.partial : text.none}</p>
        </div>
      )}
      <div className="steps">
        {result.map((step, index) => {
          const before = index ? result[index - 1].after : board
          const piece = `${text.piece} ${step.slot + 1}`
          return (
            <figure key={index}>
              <figcaption>
                <strong>
                  {text.step} {index + 1}
                </strong>
                <small>
                  {piece} · {text.lines}: {step.lines}
                </small>
              </figcaption>
              <div
                className="diagram"
                role="img"
                aria-label={`${piece}, ${text.coordinate(step.row + 1, step.col + 1)}`}
              >
                {before.map((cell, i) => {
                  const added = step.pos.includes(i)
                  const cleared = (cell || added) && !step.after[i]
                  return (
                    <i
                      key={i}
                      className={`${added ? 'added' : cell ? 'occupied' : ''} ${cleared ? 'cleared' : ''}`}
                    />
                  )
                })}
              </div>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
