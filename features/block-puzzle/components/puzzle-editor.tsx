'use client'
import { useEffect, useState } from 'react'
import { ArrowRight, Eraser } from 'lucide-react'
import { solve, type Step } from '../logic/solve'
import { emptyBoard, emptyPieces, encodePiece, paint } from '../logic/grid'
import { dictionary, type Language } from '../dictionary'
import { EditorHeader } from './editor-header'
import { DrawingGrid } from './drawing-grid'
import { PlacementSteps } from './placement-steps'

export default function PuzzleEditor() {
  const [language, setLanguage] = useState<Language>('id')
  const [board, setBoard] = useState(emptyBoard)
  const [pieces, setPieces] = useState(emptyPieces)
  const [result, setResult] = useState<Step[] | null>(null)
  const [busy, setBusy] = useState(false)
  const text = dictionary[language]
  const count = pieces.filter((piece) => piece.some(Boolean)).length

  useEffect(() => {
    document.documentElement.lang = language
    document.title = `${text.title} | Blocklab`
  }, [language, text])

  function clear() {
    setBoard(emptyBoard())
    setPieces(emptyPieces())
    setResult(null)
  }
  function search() {
    setBusy(true)
    setTimeout(() => {
      setResult(solve(board, pieces.map(encodePiece)))
      setBusy(false)
    }, 20)
  }
  function paintBoard(indices: number[], value: number) {
    setResult(null)
    setBoard((previous) => paint(previous, indices, value))
  }
  function paintPiece(slot: number, indices: number[], value: number) {
    setResult(null)
    setPieces((previous) =>
      previous.map((piece, i) =>
        i === slot ? paint(piece, indices, value) : piece,
      ),
    )
  }
  return (
    <main>
      <EditorHeader
        text={text}
        language={language}
        onLanguageChange={setLanguage}
      />
      <div className="intro">
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
      </div>
      <div className="workspace">
        <section className="card">
          <h2>{text.main}</h2>
          <p>{text.boardHint}</p>
          <div className="board-stage">
            <DrawingGrid
              coordinate={text.coordinate}
              label={text.main}
              cells={board}
              size={8}
              disabled={busy}
              onPaint={paintBoard}
            />
          </div>
          <footer>
            <small>
              {board.filter(Boolean).length} / 64 {text.filled}
            </small>
            <button disabled={busy} onClick={clear} title={text.clearAll}>
              <Eraser />
              {text.clear}
            </button>
          </footer>
        </section>
        <section className="card">
          <h2>{text.blocks}</h2>
          <p>{text.pieceHint}</p>
          <div className="pieces">
            {pieces.map((cells, slot) => (
              <div key={slot}>
                <h3>
                  {text.piece} {slot + 1}
                </h3>
                <DrawingGrid
                  coordinate={text.coordinate}
                  size={5}
                  cells={cells}
                  label={`${text.piece} ${slot + 1}`}
                  disabled={busy}
                  onPaint={(indices, value) => paintPiece(slot, indices, value)}
                />
              </div>
            ))}
          </div>
          <footer>
            <small>
              {count} / 3 {text.pieces}
            </small>
            <button
              className="primary"
              disabled={!count || busy}
              onClick={search}
            >
              {busy ? text.busy : text.place}
              <ArrowRight />
            </button>
          </footer>
        </section>
      </div>
      {result !== null && (
        <PlacementSteps
          board={board}
          result={result}
          count={count}
          text={text}
        />
      )}
    </main>
  )
}
