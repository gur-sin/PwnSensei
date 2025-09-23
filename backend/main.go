package main

import (
	"log"
	"net/http"

	"github.com/gur-sin/PwnSensei/backend/internal/handlers"
	"github.com/gur-sin/PwnSensei/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

// Read and parse PGN, extract the moves and return the list of moves to the frontend

func main() {
	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")

	api.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	api.POST("/analyze", handlers.Analyze())

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	api.POST("/analyze/commentary", handleLLMCommentary)
=======
	api.POST("/analyze/commentary", handlers.HandleLLMCommentary)

	api.POST("/generate", handlers.HandleGenerate())
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
=======
=======
>>>>>>> 31826c9 (Resolving branches)
	api.POST("/analyze/commentary", handlers.HandleLLMCommentary)

	api.POST("/generate", handlers.HandleGenerate())
=======
	api.POST("/analyze/commentary", handleLLMCommentary)
>>>>>>> 627bad0 (Wait is the pipeline already done?)
<<<<<<< HEAD
>>>>>>> 300ce77 (Wait is the pipeline already done?)
=======
=======
	api.POST("/analyze/commentary", handleLLMCommentary)
=======
	api.POST("/analyze/commentary", handlers.HandleLLMCommentary)

	api.POST("/generate", handlers.HandleGenerate())
>>>>>>> 6c80619 (parent 28de4bb86f3cc43b87effbafe551f14edf353ba1)
>>>>>>> 15f281c (Resolving branches)
>>>>>>> 31826c9 (Resolving branches)

	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"message": "Not Found", "requested_path": c.Request.URL.Path})
	})

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
