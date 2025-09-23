package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/gur-sin/PwnSensei/backend/services"
)

<<<<<<< HEAD
func handleLLMCommentary(c *gin.Context) {
=======
func HandleLLMCommentary(c *gin.Context) {
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
	var req struct {
		PGN string `json:"pgn"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

<<<<<<< HEAD
	evals, err := EvaluatePGNWithStockfish(req.PGN)
=======
	evals, err := services.EvaluatePGNWithStockfish(req.PGN)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to evaluate PGN"})
		return
	}

<<<<<<< HEAD
	prompt := FormatForLLM(evals)
=======
	prompt := services.FormatForLLM(evals)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)

	// Instead of calling an LLM, just return the prompt for now
	c.JSON(http.StatusOK, gin.H{
		"prompt": prompt,
		// Optionally also return the evaluations
		"evals": evals,
	})
}
