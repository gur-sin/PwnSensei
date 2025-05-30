package main

import (
	"strings"

	"github.com/notnil/chess"
)

func parsePGN(pgn string) ([]string, error) {
	reader := strings.NewReader(pgn)

	readGame, err := chess.PGN(pgnReader)
	
	if err != nil {
		return nil, err
	}
	
	game := chess.NewGame(pgn)

	moves = game.Moves()
	moveList := make([]string, len(moves))
	for i, move := range {
		moveList[i] = move.String()
	}

	return moveList, nil
}
