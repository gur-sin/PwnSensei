package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/gur-sin/PwnSensei/backend/services"
)

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
func handleLLMCommentary(c *gin.Context) {
=======
func HandleLLMCommentary(c *gin.Context) {
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
=======
>>>>>>> 31826c9 (Resolving branches)
func HandleLLMCommentary(c *gin.Context) {
=======
func handleLLMCommentary(c *gin.Context) {
>>>>>>> 627bad0 (Wait is the pipeline already done?)
<<<<<<< HEAD
>>>>>>> 300ce77 (Wait is the pipeline already done?)
=======
=======
func handleLLMCommentary(c *gin.Context) {
=======
func HandleLLMCommentary(c *gin.Context) {
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
>>>>>>> 15f281c (Resolving branches)
>>>>>>> 31826c9 (Resolving branches)
	var req struct {
		PGN string `json:"pgn"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	evals, err := EvaluatePGNWithStockfish(req.PGN)
=======
	evals, err := services.EvaluatePGNWithStockfish(req.PGN)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
=======
>>>>>>> 31826c9 (Resolving branches)
	evals, err := services.EvaluatePGNWithStockfish(req.PGN)
=======
	evals, err := EvaluatePGNWithStockfish(req.PGN)
>>>>>>> 627bad0 (Wait is the pipeline already done?)
<<<<<<< HEAD
>>>>>>> 300ce77 (Wait is the pipeline already done?)
=======
=======
	evals, err := EvaluatePGNWithStockfish(req.PGN)
=======
	evals, err := services.EvaluatePGNWithStockfish(req.PGN)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
>>>>>>> 15f281c (Resolving branches)
>>>>>>> 31826c9 (Resolving branches)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to evaluate PGN"})
		return
	}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	prompt := FormatForLLM(evals)
=======
	prompt := services.FormatForLLM(evals)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
=======
>>>>>>> 31826c9 (Resolving branches)
	prompt := services.FormatForLLM(evals)
=======
	prompt := FormatForLLM(evals)
>>>>>>> 627bad0 (Wait is the pipeline already done?)
<<<<<<< HEAD
>>>>>>> 300ce77 (Wait is the pipeline already done?)
=======
=======
	prompt := FormatForLLM(evals)
=======
	prompt := services.FormatForLLM(evals)
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
>>>>>>> 15f281c (Resolving branches)
>>>>>>> 31826c9 (Resolving branches)

	// Instead of calling an LLM, just return the prompt for now
	c.JSON(http.StatusOK, gin.H{
		"prompt": prompt,
		// Optionally also return the evaluations
		"evals": evals,
	})
}
