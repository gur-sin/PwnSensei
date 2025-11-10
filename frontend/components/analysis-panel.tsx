"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react"

interface AnalysisPanelProps {
  analysis: any
  isLoading?: boolean
}

export function AnalysisPanel({ analysis, isLoading }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-pulse" />
            Analyzing Position...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engine Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Click "Analyze Current Position" to see engine evaluation
          </p>
        </CardContent>
      </Card>
    )
  }

  const { analysis: engineAnalysis, moveNumber, sideToMove } = analysis

  const getEvaluationIcon = () => {
    if (engineAnalysis?.score > 0.5) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (engineAnalysis?.score < -0.5) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-yellow-600" />
  }

  const getEvaluationColor = () => {
    if (engineAnalysis?.score > 0.5) return "bg-green-100 text-green-800"
    if (engineAnalysis?.score < -0.5) return "bg-red-100 text-red-800"
    return "bg-yellow-100 text-yellow-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Engine Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position Info */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Move {moveNumber}</span>
          <Badge variant="outline">{sideToMove} to move</Badge>
        </div>

        {/* Evaluation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Evaluation</span>
            <div className="flex items-center gap-2">
              {getEvaluationIcon()}
              <Badge className={getEvaluationColor()}>{engineAnalysis?.evaluation}</Badge>
            </div>
          </div>

          {engineAnalysis?.score !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Black advantage</span>
                <span>White advantage</span>
              </div>
              <Progress value={((engineAnalysis.score + 1) / 2) * 100} className="h-2" />
              <div className="text-center text-xs text-muted-foreground">
                Score: {engineAnalysis.score > 0 ? "+" : ""}
                {engineAnalysis.score.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Best Move */}
        {engineAnalysis?.bestMove && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Best Move</span>
            <div className="bg-muted rounded p-2 font-mono text-sm">{engineAnalysis.bestMove}</div>
          </div>
        )}

        {/* Principal Variation */}
        {engineAnalysis?.principalVariation && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Main Line</span>
            <div className="bg-muted rounded p-2 font-mono text-sm">{engineAnalysis.principalVariation}</div>
          </div>
        )}

        {/* Engine Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          {engineAnalysis?.depth && (
            <div>
              <span className="font-medium">Depth:</span> {engineAnalysis.depth}
            </div>
          )}
          {engineAnalysis?.nodes && (
            <div>
              <span className="font-medium">Nodes:</span> {engineAnalysis.nodes.toLocaleString()}
            </div>
          )}
          {engineAnalysis?.time && (
            <div>
              <span className="font-medium">Time:</span> {engineAnalysis.time}ms
            </div>
          )}
          {engineAnalysis?.tactical && (
            <div>
              <Badge variant="secondary" className="text-xs">
                Tactical
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
