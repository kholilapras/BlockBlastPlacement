const BOARD_SIZE = 8
const SLOT_VALUES = [4, 1, 2]

interface Placement {
  row: number
  col: number
  pos: number[]
}

export interface Step extends Placement {
  slot: number
  after: number[]
  lines: number
}

function possiblePlacements(shape: string): Placement[] {
  if (!shape) return []
  const rows = shape.split('/')
  const offsets = rows.flatMap((row, y) =>
    Array.from(row).flatMap((cell, x) =>
      cell === '1' ? [y * BOARD_SIZE + x] : [],
    ),
  )
  const placements: Placement[] = []
  for (let row = 0; row <= BOARD_SIZE - rows.length; row++) {
    for (let col = 0; col <= BOARD_SIZE - rows[0].length; col++) {
      const origin = row * BOARD_SIZE + col
      placements.push({
        row,
        col,
        pos: offsets.map((offset) => origin + offset),
      })
    }
  }
  return placements
}

const rows = Array.from({ length: BOARD_SIZE }, (_, row) =>
  Array.from({ length: BOARD_SIZE }, (_, col) => row * BOARD_SIZE + col),
)
const columns = rows.map((_, col) => rows.map((row) => row[col]))
const boardLines = [...rows, ...columns]

function placePiece(board: number[], placement: Placement, slot: number): Step {
  const after = board.slice()
  for (const index of placement.pos) after[index] = SLOT_VALUES[slot]
  // baris dan kolom secara bersamaan agar garis yang saling berpotongan tetap dihitung sebelum salah satu dihapus
  const completed = boardLines.filter((line) =>
    line.every((index) => after[index]),
  )
  for (const line of completed) for (const index of line) after[index] = 0
  return { ...placement, slot, after, lines: completed.length }
}

function edgeContacts(indices: number[]): number {
  return indices.reduce((total, index) => {
    const col = index % BOARD_SIZE
    const row = Math.floor(index / BOARD_SIZE)
    return (
      total +
      Number(col === 0 || col === BOARD_SIZE - 1) +
      Number(row === 0 || row === BOARD_SIZE - 1)
    )
  }, 0)
}

export function solve(board: number[], pieces: string[]): Step[] {
  const placements = pieces.map(possiblePlacements)
  const path: Step[] = []
  let bestPath: Step[] = []
  let bestScore = -1

  function search(
    currentBoard: number[],
    usedSlots: number,
    linesCleared: number,
  ) {
    for (let slot = 0; slot < placements.length; slot++) {
      const slotBit = 1 << slot
      if (usedSlots & slotBit) continue
      for (const placement of placements[slot]) {
        if (placement.pos.some((index) => currentBoard[index])) continue
        const step = placePiece(currentBoard, placement, slot)
        const totalLines = linesCleared + step.lines
        path.push(step)
        // prioritas jumlah blok, garis yang dihapus
        const score =
          path.length * 100_000 + totalLines * 1_000 + edgeContacts(step.pos)
        if (score > bestScore) {
          bestScore = score
          bestPath = path.slice()
        }
        if (path.length < placements.length)
          search(step.after, usedSlots | slotBit, totalLines)
        path.pop()
      }
    }
  }

  search(board, 0, 0)
  return bestPath
}
