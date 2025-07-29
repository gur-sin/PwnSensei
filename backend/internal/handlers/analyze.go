package handlers

import (
	"net/http"

	"github.com/gur-sin/PwnSensei/backend/services/evaluator.go"

	"github.com/gin-gonic/gin"
)

// Creating structs for JSON request and response
type AnalyzeRequest struct {
	PGN string `json:"pgn"`
}

func Analyze() gin.HandlerFunc {
	return func(c *gin.Context) {
		// This will handle the pgn data apparently.
		var req AnalyzeRequest

		err := c.ShouldBindJSON(&req)
		if err != nil {
			c.JSON(400, gin.H{"error": "Could not parse PGN"})
			return
		}

		evals, err := services.EvaluatePGNWithStockfish(req.PGN)
		if err != nil {
			c.JSON(400, gin.H{"error": "Error during PGN evaluation", "details": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"evaluations": evals,
		})
		c.Next()
	}
}
