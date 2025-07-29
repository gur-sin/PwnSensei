package handlers

import (
	"net/http"

<<<<<<< HEAD
=======
	"github.com/gur-sin/PwnSensei/backend/services/evaluator.go"

>>>>>>> a5b014d (Doing some backend work)
	"github.com/gin-gonic/gin"
	"github.com/gur-sin/PwnSensei/backend/services"
)

// Creating structs for JSON request and response
type AnalyzeRequest struct {
	PGN string `json:"pgn"`
}

func Analyze() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req AnalyzeRequest

		if err := c.ShouldBindJSON(&req); err != nil {
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
<<<<<<< HEAD
=======
		c.Next()
>>>>>>> a5b014d (Doing some backend work)
	}
}
