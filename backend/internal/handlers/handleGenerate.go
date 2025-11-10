package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gur-sin/PwnSensei/backend/services"
	"github.com/gur-sin/PwnSensei/backend/services/llm"
)

type GenerateRequest struct {
	PGN    string `json:"pgn"`
	Prompt string `json:"prompt"`
}

func HandleGenerate() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req GenerateRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Println("Failed to parse request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		log.Println("Received PGN:", req.PGN)
		log.Println("Prompt:", req.Prompt)

		// Run Stockfish
		evals, err := services.EvaluatePGNWithStockfish(req.PGN)
		if err != nil {
			log.Println("Stockfish error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Stockfish evaluation failed", "details": err.Error()})
			return
		}
		log.Println("Stockfish returned", len(evals), "evaluations")

		// Get Gemini API key
		apiKey := os.Getenv("GEMINI_API_KEY")
		if apiKey == "" {
			log.Println("Missing GEMINI_API_KEY in environment")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server misconfigured: missing GEMINI_API_KEY"})
			return
		}

		// Format Stockfish evals into human-readable text
		var evalStrings []string
		for _, e := range evals {
			var score string
			if e.ScoreCP != nil {
				score = fmt.Sprintf("%d cp", *e.ScoreCP)
			} else if e.Mate != nil {
				score = fmt.Sprintf("mate in %d", *e.Mate)
			} else {
				score = "unknown"
			}
			evalStrings = append(evalStrings, fmt.Sprintf(
				"%s → Best reply: %s | Score: %s",
				e.Move, e.BestReply, score,
			))
		}

		// Ask Gemini for commentary
		commentary, err := llm.GenerateCommentary(apiKey, req.Prompt, evalStrings)
		if err != nil {
			log.Println("Gemini LLM error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gemini generation failed", "details": err.Error()})
			return
		}

		log.Println("Gemini returned commentary")

		c.JSON(http.StatusOK, gin.H{
			"evaluations": evals,
			"commentary":  commentary,
		})
	}
}
