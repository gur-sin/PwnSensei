package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/gur-sin/PwnSensei/backend/services"
)

<<<<<<< HEAD
<<<<<<< HEAD
func handleLLMCommentary(c *gin.Context) {
=======
func HandleLLMCommentary(c *gin.Context) {
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
func HandleLLMCommentary(c *gin.Context) {
=======
func handleLLMCommentary(c *gin.Context) {
>>>>>>> 627bad0 (Wait is the pipeline already done?)
>>>>>>> 300ce77 (Wait is the pipeline already done?)
	var req struct {
		PGN string `json:"pgn"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

<<<<<<< HEAD
<<<<<<< HEAD
	evals, err := EvaluatePGNWithStockfish(req.PGN)
=======
	evals, err := services.EvaluatePGNWithStockfish(req.PGN)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
	evals, err := services.EvaluatePGNWithStockfish(req.PGN)
=======
	evals, err := EvaluatePGNWithStockfish(req.PGN)
>>>>>>> 627bad0 (Wait is the pipeline already done?)
>>>>>>> 300ce77 (Wait is the pipeline already done?)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to evaluate PGN"})
		return
	}

<<<<<<< HEAD
<<<<<<< HEAD
	prompt := FormatForLLM(evals)
=======
	prompt := services.FormatForLLM(evals)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
	prompt := services.FormatForLLM(evals)
=======
	prompt := FormatForLLM(evals)
>>>>>>> 627bad0 (Wait is the pipeline already done?)
>>>>>>> 300ce77 (Wait is the pipeline already done?)

	// Instead of calling an LLM, just return the prompt for now
	c.JSON(http.StatusOK, gin.H{
		"prompt": prompt,
		// Optionally also return the evaluations
		"evals": evals,
	})
}
