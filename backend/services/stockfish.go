package services

import (
	"bufio"
	"os/exec"
)

func AnalyzeWithStockfish(fen string) string {
	cmd := exec.Command("../engines/stockfish/stockfish-ubuntu-x86-64-avx2")
	stdin, _ := cmd.StdinPipe()
	stdout, _ := cmd.StdoutPipe()
	scanner := bufio.NewScanner(stdout)

	cmd.Start()
	stdin.Write([]byte("uci\n"))
	stdin.Write([]byte("isready\n"))
	stdin.Write([]byte("position fen " + fen + "\n"))
	stdin.Write([]byte("go depth 15\n"))

	var output string
	for scanner.Scan() {
		line := scanner.Text()
		if line[:8] == "bestmove" {
			output = line
			break
		}
	}

	cmd.Process.Kill()
	return output
}
