package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Creating structs for JSON request and response
type AnalyzeRequest struct {
	PGN string `json:"pgn"`
}

type analyzeResponse struct {
	Moves string `json:"moves"`
}

// Read and parse PGN, extract the moves and return the list of moves to the frontend

func main() {
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.POST("/analyze", func(c *gin.Context) {
		// This will handle the pgn data apparently.
		var req AnalyzeRequest

		err := c.ShouldBindJSON(&req)
		if err != nil {
			c.JSON(400, gin.H{"error": "Could not parse PGN"})
			return
		}

		moves, err := parsePGN(req.PGN)
		if err != nil {
			c.JSON(400, gin.H{"error": "Error in the PGN parsing function"})
		}

		c.JSON(http.StatusOK, gin.H{
			"moves": moves,
		})
	})

	r.Run()
}
