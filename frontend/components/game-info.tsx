"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Trophy, Clock } from "lucide-react"

interface GameInfoProps {
  pgn: string
}

export function GameInfo({ pgn }: GameInfoProps) {
  const parseGameInfo = (pgnString: string) => {
    const lines = pgnString.split("\n")
    const headers: Record<string, string> = {}

    for (const line of lines) {
      const match = line.match(/\[(\w+)\s+"([^"]+)"\]/)
      if (match) {
        headers[match[1]] = match[2]
      }
    }

    return headers
  }

  if (!pgn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Import a PGN to see game details</p>
        </CardContent>
      </Card>
    )
  }

  const gameInfo = parseGameInfo(pgn)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gameInfo.White && gameInfo.Black && (
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{gameInfo.Date}</span>
          </div>
        )}

        {gameInfo.TimeControl && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{gameInfo.TimeControl}</span>
          </div>
        )}

        {gameInfo.Event && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Event:</span>
            <p className="text-sm text-muted-foreground">{gameInfo.Event}</p>
          </div>
        )}

        {gameInfo.Opening && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Opening:</span>
            <p className="text-sm text-muted-foreground">{gameInfo.Opening}</p>
          </div>
        )}

        {gameInfo.ECO && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{gameInfo.ECO}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
