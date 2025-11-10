// Chess analysis API client for Go backend integration

export interface StockfishAnalysis {
  evaluation: number
  bestMove: string
  principalVariation: string[]
  depth: number
  nodes: number
  time: number
  mate?: number
  tactical?: {
    type: string
    description: string
  }
}

export interface AnalysisResponse {
  position: string
  analysis: StockfishAnalysis
  error?: string
}

export interface CommentaryResponse {
  commentary: string
  analysis: StockfishAnalysis
  error?: string
}

export interface GenerateResponse {
  evaluations: StockfishAnalysis[]
  commentary: string
  error?: string
}

export class ChessAPI {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async generate(pgn: string): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pgn,
        }),
      })

      if (!response.ok) {
        throw new Error(`Generate failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Generate API error:", error)
      throw error
    }
  }

  async analyzePosition(pgn: string, moveNumber?: number): Promise<AnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pgn,
          moveNumber: moveNumber || 0,
        }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Analysis API error:", error)
      throw error
    }
  }

  async getCommentary(
    pgn: string,
    analysis: StockfishAnalysis,
    userPrompt?: string,
    moveNumber?: number,
  ): Promise<CommentaryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze/commentary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pgn,
          analysis,
          userPrompt,
          moveNumber: moveNumber || 0,
        }),
      })

      if (!response.ok) {
        throw new Error(`Commentary failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Commentary API error:", error)
      throw error
    }
  }
}

export const chessAPI = new ChessAPI()
