const PIECE_SIZE = 5

export const emptyBoard = () => Array<number>(64).fill(0)
export const emptyPieces = () =>
  Array.from({ length: 3 }, () => Array<number>(PIECE_SIZE ** 2).fill(0))

export function paint(cells: number[], indices: number[], value: number) {
  return cells.map((cell, index) => (indices.includes(index) ? value : cell))
}

export function encodePiece(cells: number[]): string {
  const occupied = cells.flatMap((cell, index) => (cell ? [index] : []))
  if (!occupied.length) return ''
  const columns = occupied.map((index) => index % PIECE_SIZE)
  const left = Math.min(...columns)
  const right = Math.max(...columns)
  const top = Math.floor(occupied[0] / PIECE_SIZE)
  const bottom = Math.floor(occupied[occupied.length - 1] / PIECE_SIZE)
  const rows = []
  for (let row = top; row <= bottom; row++) {
    const start = row * PIECE_SIZE
    rows.push(cells.slice(start + left, start + right + 1).join(''))
  }
  return rows.join('/')
}
