package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/gur-sin/PwnSensei/backend/services"
)

func handleLLMCommentary(c *gin.Context) {
	var req struct {
		PGN string `json:"pgn"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	evals, err := EvaluatePGNWithStockfish(req.PGN)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to evaluate PGN"})
		return
	}

	prompt := FormatForLLM(evals)

	// Instead of calling an LLM, just return the prompt for now
	c.JSON(http.StatusOK, gin.H{
		"prompt": prompt,
		// Optionally also return the evaluations
		"evals": evals,
	})
}
