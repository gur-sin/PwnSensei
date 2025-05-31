package main

import (
	"strings"

	"github.com/notnil/chess"
)

func ParsePGN(pgn string) ([]string, error) {
	reader := strings.NewReader(pgn)

	readGame, err := chess.PGN(reader)
	if err != nil {
		return nil, err
	}

	game := chess.NewGame(readGame)

	moves := game.Moves()
	moveList := make([]string, len(moves))
	for i, move := range moves {
		moveList[i] = move.String()
	}

	return moveList, nil
}
