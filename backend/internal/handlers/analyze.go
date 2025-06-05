package handlers

import (
	"net/http"

	"github.com/gur-sin/PwnSensei/backend/internal/pgn"

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

		moves, err := pgn.ParsePGN(req.PGN)
		if err != nil {
			c.JSON(400, gin.H{"error": "Error in the PGN parsing function"})
		}

		c.JSON(http.StatusOK, gin.H{
			"moves": moves,
		})

		c.Next()
	}
}
