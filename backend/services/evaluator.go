package services

import (
	"github.com/notnil/chess"
	"strings"
)

type MoveEvaluation struct {
	Move      string `json:"move"`
	BestReply string `json:"best_reply"`
	FEN       string `json:"fen"`
}

func EvaluatePGNWithStockfish(pgnStr string) ([]MoveEvaluation, error) {
	reader := strings.NewReader(pgnStr)
	readGame, err := chess.PGN(reader)
	if err != nil {
		return nil, err
	}

	game := chess.NewGame(readGame)
	moves := game.Moves()

	evaluations := []MoveEvaluation{}
	game = chess.NewGame() // Start fresh to play moves one by one

	for _, move := range moves {
		game.Move(move)
		fen := game.Position().String()
		bestmoveLine := AnalyzeWithStockfish(fen)

		// Parse the bestmove from line (e.g., "bestmove e5" -> e5)
		bestReply := ""
		parts := strings.Split(bestmoveLine, " ")
		if len(parts) >= 2 {
			bestReply = parts[1]
		}

		evaluations = append(evaluations, MoveEvaluation{
			Move:      move.String(),
			BestReply: bestReply,
			FEN:       fen,
		})
	}

	return evaluations, nil
}
