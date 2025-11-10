"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Calendar, User, Trophy, Clock } from "lucide-react"

interface PgnImportProps {
  onPgnImport: (pgn: string) => void
  pgn: string
}

export function PgnImport({ onPgnImport, pgn }: PgnImportProps) {
  const [pgnText, setPgnText] = useState("")
  const [gameInfo, setGameInfo] = useState<Record<string, string>>({})

  useEffect(() => {
    if (pgn) {
      parseGameInfo(pgn)
    }
  }, [pgn])

  const parseGameInfo = (pgnString: string) => {
    const lines = pgnString.split("\n")
    const headers: Record<string, string> = {}

    for (const line of lines) {
      const match = line.match(/\[(\w+)\s+"([^"]+)"\]/)
      if (match) {
        headers[match[1]] = match[2]
      }
    }

    setGameInfo(headers)
  }

  const handleImport = () => {
    if (pgnText.trim()) {
      onPgnImport(pgnText.trim())
    }
  }

  const handleSamplePgn = () => {
    const samplePgn = `[Event "Sample Game"]
[Site "Chess.com"]
[Date "2024.01.01"]
[Round "1"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5 Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6 23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5 hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5 35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6 Nf2 42. g4 Bd3 43. Re6 1-0`

    setPgnText(samplePgn)
    onPgnImport(samplePgn)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import PGN
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your PGN here..."
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          rows={6}
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button onClick={handleImport} disabled={!pgnText.trim()}>
            Import PGN
          </Button>
          <Button variant="outline" onClick={handleSamplePgn}>
            Load Sample Game
          </Button>
        </div>

        {pgn && Object.keys(gameInfo).length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-medium text-sm">Game Information</h3>
            {gameInfo.White && gameInfo.Black && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{gameInfo.White}</span>
                <span className="text-muted-foreground">vs</span>
                <span className="font-medium">{gameInfo.Black}</span>
              </div>
            )}

            {gameInfo.Result && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <Badge variant="outline">{gameInfo.Result}</Badge>
              </div>
            )}

            {gameInfo.Date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{gameInfo.Date}</span>
              </div>
            )}

            {gameInfo.TimeControl && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{gameInfo.TimeControl}</span>
              </div>
            )}

            {gameInfo.Opening && (
              <div className="text-sm">
                <span className="font-medium">Opening: </span>
                <span className="text-muted-foreground">{gameInfo.Opening}</span>
              </div>
            )}

            {gameInfo.ECO && (
              <Badge variant="secondary" className="text-xs">
                {gameInfo.ECO}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
