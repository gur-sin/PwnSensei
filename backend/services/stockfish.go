package services

import (
	"bufio"
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

<<<<<<< HEAD
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
=======
func AnalyzeWithStockfish(fen string) string {
	cmd := exec.Command("../engines/stockfish/stockfish-ubuntu-x86-64-avx2")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return "error: could not get stdin"
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return "error: could not get stdout"
	}

	if err := cmd.Start(); err != nil {
		return "error: could not start Stockfish"
>>>>>>> a5b014d (Doing some backend work)
	}

	scanner := bufio.NewScanner(stdout)

	stdin.Write([]byte("uci\n"))
	stdin.Write([]byte("isready\n"))
<<<<<<< HEAD
=======

	ready := false
	for scanner.Scan() {
		line := scanner.Text()
		if line == "readyok" {
			ready = true
			break
		}
	}
	if !ready {
		return "error: stockfish not ready"
	}

	stdin.Write([]byte("position fen " + fen + "\n"))
	stdin.Write([]byte("go depth 15\n"))
>>>>>>> a5b014d (Doing some backend work)

	for scanner.Scan() {
<<<<<<< HEAD
		if scanner.Text() == "readyok" {
=======
		line := scanner.Text()
		if len(line) >= 8 && line[:8] == "bestmove" {
			output = line
>>>>>>> a5b014d (Doing some backend work)
			break
		}
	}

<<<<<<< HEAD
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
=======
	stdin.Write([]byte("quit\n"))
	cmd.Wait()

	return output
>>>>>>> a5b014d (Doing some backend work)
}
