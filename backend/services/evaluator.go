package services

import (
	"fmt"
	"github.com/notnil/chess"
	"strings"
)

type MoveEvaluation struct {
	Move      string `json:"move"`
	BestReply string `json:"best_reply"`
	FEN       string `json:"fen"`
	ScoreCP   *int   `json:"score_cp,omitempty"` // nil if mate
	Mate      *int   `json:"mate,omitempty"`
}

type StockfishEval struct {
	BestMove string `json:"best_move"`
	ScoreCP  *int   `json:"score_cp,omitempty"` // nil if mate
	Mate     *int   `json:"mate,omitempty"`     // nil if centipawn
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

	for i := 0; i < len(moves); i++ {
		move := moves[i]
		game.Move(move)
		fen := game.Position().String()
		eval := AnalyzeWithStockfish(fen)

		evaluations = append(evaluations, MoveEvaluation{
			Move:      move.String(),
			BestReply: eval.BestMove,
			FEN:       fen,
			ScoreCP:   eval.ScoreCP,
			Mate:      eval.Mate,
		})
	}

	return evaluations, nil
}

func FormatForLLM(evaluations []MoveEvaluation) string {
	var sb strings.Builder
	sb.WriteString("This is a chess game. Analyze it move by move and comment on each move from both players.\n")

	for i, eval := range evaluations {
		moveNumber := i/2 + 1
		player := "White"
		if i%2 != 0 {
			player = "Black"
		}
		sb.WriteString(fmt.Sprintf("%d. %s plays %s", moveNumber, player, eval.Move))

		if eval.Mate != nil {
			sb.WriteString(fmt.Sprintf(" (mate in %d)", *eval.Mate))
		} else if eval.ScoreCP != nil {
			sb.WriteString(fmt.Sprintf(" (eval: %+d centipawns)", *eval.ScoreCP))
		}

		if eval.BestReply != "" {
			sb.WriteString(fmt.Sprintf(". Best reply according to engine: %s", eval.BestReply))
		}

		sb.WriteString("\n")
	}

	return sb.String()
}
