package services

import (
	"bufio"
	"os/exec"
)

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
	}

	scanner := bufio.NewScanner(stdout)

	stdin.Write([]byte("uci\n"))
	stdin.Write([]byte("isready\n"))

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

	var output string
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) >= 8 && line[:8] == "bestmove" {
			output = line
			break
		}
	}

	stdin.Write([]byte("quit\n"))
	cmd.Wait()

	return output
}
