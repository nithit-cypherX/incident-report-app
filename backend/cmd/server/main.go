package main

import (
    "log"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"

    "github.com/nithit-cypherX/incident-report-app/backend/internal/database"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/handler"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/model"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/repository"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/service"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    // DB
    db := database.Connect()
    db.AutoMigrate(&model.Incident{})

    // Wire the 3 layers
    repo    := repository.NewIncidentRepository(db)
    svc     := service.NewIncidentService(repo)
    h       := handler.NewIncidentHandler(svc)

    // Router
    r := gin.Default()

    // CORS — allow frontend to call the API
    r.Use(func(c *gin.Context) {
        c.Header("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
        c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Header("Access-Control-Allow-Headers", "Content-Type")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    // Incident routes
    v1 := r.Group("/api/v1")
    {
        v1.GET("/incidents",        h.GetAll)
        v1.GET("/incidents/:id",    h.GetByID)
        v1.POST("/incidents",       h.Create)
        v1.PUT("/incidents/:id",    h.Update)
        v1.DELETE("/incidents/:id", h.Delete)
    }

    port := os.Getenv("SERVER_PORT")
    if port == "" {
        port = "8080"
    }
    log.Printf("Server running on :%s", port)
    r.Run(":" + port)
}