"use client"

import { useState } from "react"
import { ChessBoard } from "@/components/chess-board"
import { PgnImport } from "@/components/pgn-import"
import { LLMChat } from "@/components/llm-chat"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { ApiConfig } from "@/components/api-config"

export default function ChessAnalyzer() {
  const [pgn, setPgn] = useState<string>("")
  const [currentPosition, setCurrentPosition] = useState<number>(0)
  const [analysis, setAnalysis] = useState<any>(null)
  const [apiUrl, setApiUrl] = useState<string>("http://localhost:8080")

  const handlePgnImport = (newPgn: string) => {
    console.log("[v0] Importing new PGN, resetting position to 0")
    setPgn(newPgn)
    setCurrentPosition(0)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 flex items-center justify-center gap-3">
          <div className="flex-1" />
          <div>
            <h1 className="text-4xl font-bold mb-2">PwnSensei Chess Analyzer</h1>
            <p className="text-muted-foreground">Advanced chess analysis powered by Stockfish and AI commentary</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <ApiConfig onApiUrlChange={setApiUrl} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Chess Board and Controls */}
          <div className="space-y-4">
            <PgnImport onPgnImport={handlePgnImport} pgn={pgn} />

            <ChessBoard
              pgn={pgn}
              currentPosition={currentPosition}
              onPositionChange={setCurrentPosition}
              analysis={analysis}
            />
          </div>

          {/* Right side - LLM Chat */}
          <div className="space-y-4">
            <LLMChat
              pgn={pgn}
              currentPosition={currentPosition}
              analysis={analysis}
              onAnalysisUpdate={setAnalysis}
              apiUrl={apiUrl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
