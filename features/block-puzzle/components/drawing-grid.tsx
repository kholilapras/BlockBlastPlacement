'use client'
import { useRef, type CSSProperties, type PointerEvent } from 'react'

type Props = {
  coordinate: (row: number, col: number) => string
  cells: number[]
  size: number
  label: string
  onPaint: (indices: number[], value: number) => void
  accent?: string
  targets?: number[]
  disabled?: boolean
}
export function DrawingGrid({
  coordinate,
  cells,
  size,
  label,
  onPaint,
  accent,
  targets,
  disabled,
}: Props) {
  const stroke = useRef<{ id: number; value: number; last: number } | null>(
    null,
  )
  function position(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * size)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * size)
    return x >= 0 && y >= 0 && x < size && y < size ? y * size + x : -1
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const s = stroke.current
    if (!s || s.id !== e.pointerId) return
    const i = position(e),
      prev = s.last
    s.last = i
    if (i < 0 || prev === i) return
    const x = prev < 0 ? i % size : prev % size,
      y = Math.floor((prev < 0 ? i : prev) / size)
    const dx = (i % size) - x,
      dy = Math.floor(i / size) - y,
      steps = Math.max(1, Math.abs(dx), Math.abs(dy))
    onPaint(
      Array.from(
        { length: steps },
        (_, k) =>
          Math.round(y + (dy * (k + 1)) / steps) * size +
          Math.round(x + (dx * (k + 1)) / steps),
      ),
      s.value,
    )
  }
  return (
    <div
      role="group"
      aria-label={label}
      className={'drawing-grid ' + (size === 8 ? 'board' : 'mini')}
      style={{ '--n': size, '--accent': accent } as CSSProperties}
      onPointerDown={(e) => {
        if (disabled || !e.isPrimary || e.button !== 0) return
        const i = position(e)
        if (i < 0) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        stroke.current = { id: e.pointerId, value: cells[i] ? 0 : 1, last: i }
        onPaint([i], stroke.current.value)
      }}
      onPointerMove={move}
      onPointerUp={() => {
        stroke.current = null
      }}
      onLostPointerCapture={() => {
        stroke.current = null
      }}
      onPointerCancel={() => {
        stroke.current = null
      }}
    >
      {cells.map((v, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          className={`${v ? 'filled' : ''} ${targets?.includes(i) ? 'target' : ''}`}
          aria-pressed={!!v}
          aria-label={`${label}, ${coordinate(Math.floor(i / size) + 1, (i % size) + 1)}`}
          onClick={(e) => {
            if (e.detail === 0) onPaint([i], v ? 0 : 1)
          }}
        />
      ))}
    </div>
  )
}
