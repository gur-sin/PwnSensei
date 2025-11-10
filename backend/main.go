package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gur-sin/PwnSensei/backend/internal/handlers"
	"github.com/gur-sin/PwnSensei/backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Read and parse PGN, extract the moves and return the list of moves to the frontend

func main() {
	_ = godotenv.Load()

	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found or failed to load")
	}

	if os.Getenv("GEMINI_API_KEY") == "" {
		log.Println("Warning: GEMINI_API_KEY is missing from environment")
	}

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")

	api.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	api.POST("/analyze", handlers.Analyze())

	api.POST("/analyze/commentary", handlers.HandleLLMCommentary)

	api.POST("/generate", handlers.HandleGenerate())

	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"message": "Not Found", "requested_path": c.Request.URL.Path})
	})

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
