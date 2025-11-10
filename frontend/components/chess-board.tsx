"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react"
import { AnalysisPanel } from "./analysis-panel"

interface ChessBoardProps {
  pgn: string
  currentPosition: number
  onPositionChange: (position: number) => void
  analysis?: any
}

const CustomChessBoard = ({ position, moveSquares }: { position: string; moveSquares: Record<string, any> }) => {
  const [boardState, setBoardState] = useState<string[][]>([])

  useEffect(() => {
    // Parse FEN to create board state
    const parseFEN = (fen: string) => {
      const [boardPart] = fen.split(" ")
      const ranks = boardPart.split("/")
      const board: string[][] = []

      for (const rank of ranks) {
        const row: string[] = []
        for (const char of rank) {
          if (isNaN(Number.parseInt(char))) {
            row.push(char)
          } else {
            // Add empty squares
            for (let i = 0; i < Number.parseInt(char); i++) {
              row.push("")
            }
          }
        }
        board.push(row)
      }
      return board
    }

    setBoardState(parseFEN(position))
  }, [position])

  const getPieceSymbol = (piece: string) => {
    const pieces: Record<string, string> = {
      K: "♔",
      Q: "♕",
      R: "♖",
      B: "♗",
      N: "♘",
      P: "♙",
      k: "♚",
      q: "♛",
      r: "♜",
      b: "♝",
      n: "♞",
      p: "♟",
    }
    return pieces[piece] || ""
  }

  const getSquareName = (row: number, col: number) => {
    return String.fromCharCode(97 + col) + (8 - row)
  }

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  return (
    <div className="inline-block border-2 border-gray-800 rounded">
      {boardState.map((rank, rankIndex) => (
        <div key={rankIndex} className="flex">
          {rank.map((piece, fileIndex) => {
            const squareName = getSquareName(rankIndex, fileIndex)
            const isLight = isLightSquare(rankIndex, fileIndex)
            const isHighlighted = moveSquares[squareName]

            return (
              <div
                key={`${rankIndex}-${fileIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-4xl font-bold select-none
                  ${isLight ? "bg-amber-100" : "bg-amber-800"}
                  ${isHighlighted ? "bg-yellow-400" : ""}
                `}
                style={{
                  backgroundColor: isHighlighted ? "rgba(255, 255, 0, 0.6)" : undefined,
                }}
              >
                <span
                  className="drop-shadow-lg"
                  style={{
                    textShadow: piece
                      ? piece === piece.toUpperCase()
                        ? "1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(255,255,255,0.3)"
                        : "1px 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(0,0,0,0.3)"
                      : "none",
                    filter: "contrast(1.2)",
                  }}
                >
                  {getPieceSymbol(piece)}
                </span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function ChessBoard({ pgn, currentPosition, onPositionChange, analysis }: ChessBoardProps) {
  const [moves, setMoves] = useState<any[]>([])
  const [game, setGame] = useState<any>(null)
  const [boardPosition, setBoardPosition] = useState<string>("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  const [moveSquares, setMoveSquares] = useState<Record<string, any>>({})

  useEffect(() => {
    const initializeGame = async () => {
      if (typeof window !== "undefined") {
        const { Chess } = await import("chess.js")
        const chess = new Chess()
        setGame(chess)
      }
    }

    initializeGame()
  }, [])

  useEffect(() => {
    if (pgn && game) {
      parsePgn(pgn)
    }
  }, [pgn, game])

  useEffect(() => {
    if (game && moves.length > 0) {
      updateBoardPosition()
    }
  }, [currentPosition, game, moves])

  const parsePgn = (pgnString: string) => {
    if (!game) return

    try {
      game.loadPgn(pgnString)
      const history = game.history({ verbose: true })
      setMoves(history)

      game.reset()
      const startingFen = game.fen()
      console.log("[v0] Parsing PGN, setting starting position:", startingFen)
      setBoardPosition(startingFen)
      setMoveSquares({})

      if (currentPosition !== 0) {
        onPositionChange(0)
      }
    } catch (error) {
      console.error("Error parsing PGN:", error)
    }
  }

  const updateBoardPosition = () => {
    if (!game || moves.length === 0) return

    console.log("[v0] Updating board position to:", currentPosition)

    game.reset()

    for (let i = 0; i < currentPosition; i++) {
      if (moves[i]) {
        try {
          game.move(moves[i])
        } catch (error) {
          console.error("[v0] Error making move:", moves[i], error)
          break
        }
      }
    }

    const newFen = game.fen()
    console.log("[v0] New FEN position:", newFen)
    setBoardPosition(newFen)

    if (currentPosition > 0 && moves[currentPosition - 1]) {
      const lastMove = moves[currentPosition - 1]
      setMoveSquares({
        [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      })
    } else {
      setMoveSquares({})
    }
  }

  const goToPosition = (position: number) => {
    const newPosition = Math.max(0, Math.min(moves.length, position))
    console.log("[v0] Going to position:", newPosition)
    onPositionChange(newPosition)
  }

  console.log("[v0] ChessBoard render - boardPosition:", boardPosition, "currentPosition:", currentPosition)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Chess Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="w-full max-w-md mx-auto flex justify-center">
              <CustomChessBoard position={boardPosition} moveSquares={moveSquares} />
            </div>
          </div>

          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => goToPosition(0)} disabled={currentPosition === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPosition(currentPosition - 1)}
              disabled={currentPosition === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPosition(currentPosition + 1)}
              disabled={currentPosition >= moves.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPosition(moves.length)}
              disabled={currentPosition >= moves.length}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {moves.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Move List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {moves.map((move, index) => (
                    <Button
                      key={index}
                      variant={index === currentPosition - 1 ? "default" : "ghost"}
                      size="sm"
                      className="justify-start text-left"
                      onClick={() => goToPosition(index + 1)}
                    >
                      <span className="text-muted-foreground mr-2">
                        {Math.floor(index / 2) + 1}
                        {index % 2 === 0 ? "." : "..."}
                      </span>
                      {move.san}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {analysis && <AnalysisPanel analysis={analysis} />}
    </div>
  )
}
