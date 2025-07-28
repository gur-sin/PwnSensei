package services

import (
	"bufio"
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

func AnalyzeWithStockfish(fen string) StockfishEval {
	cmd := exec.Command("/home/gursin/programming/projects/PwnSensei/backend/engines/stockfish/stockfish-ubuntu-x86-64-avx2")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return StockfishEval{}
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return StockfishEval{}
	}

	if err := cmd.Start(); err != nil {
		return StockfishEval{}
	}

	scanner := bufio.NewScanner(stdout)

	stdin.Write([]byte("uci\n"))
	stdin.Write([]byte("isready\n"))

	for scanner.Scan() {
		if scanner.Text() == "readyok" {
			break
		}
	}

	stdin.Write([]byte("position fen " + fen + "\n"))
	stdin.Write([]byte("go depth 15\n"))

	var bestmove string
	var scoreCP *int
	var mate *int

	foundBestMove := false
	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println("STOCKFISH>", line)
		if strings.HasPrefix(line, "info") && strings.Contains(line, "score") {
			fields := strings.Fields(line)
			for i := 0; i < len(fields); i++ {
				if fields[i] == "score" && i+2 < len(fields) {
					switch fields[i+1] {
					case "cp":
						val, err := strconv.Atoi(fields[i+2])
						if err == nil {
							scoreCP = new(int)
							*scoreCP = val
						}
					case "mate":
						val, err := strconv.Atoi(fields[i+2])
						if err == nil {
							mate = new(int)
							*mate = val
						}
					}
				}
			}
		} else if strings.HasPrefix(line, "bestmove") {
			fields := strings.Fields(line)
			if len(fields) >= 2 {
				bestmove = fields[1]
				foundBestMove = true
			}
			break
		}
	}

	// If bestmove still not found, wait longer for safety (optional fallback)
	if !foundBestMove {
		for scanner.Scan() {
			line := scanner.Text()
			fmt.Println("Raw Stockfish line:", line)
			if strings.HasPrefix(line, "bestmove") {
				fields := strings.Fields(line)
				if len(fields) >= 2 {
					bestmove = fields[1]
					break
				}
			}
		}
	}

	stdin.Write([]byte("quit\n"))
	cmd.Wait()

	return StockfishEval{
		BestMove: bestmove,
		ScoreCP:  scoreCP,
		Mate:     mate,
	}
}
