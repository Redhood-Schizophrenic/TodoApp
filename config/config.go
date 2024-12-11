package config

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/cors" // Correct import for CORS
	"Todo/models"
)

var (
	app     *fiber.App
	todoCrud *models.TodoCrud
)

func Init() {
	app = fiber.New()
	
	// CORS configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Adjust as necessary
		AllowMethods: "GET,POST,PUT,DELETE",
	}))

	// Initialize your database and models here
	todoCrud = models.NewTodoCrud(yourDatabaseInstance) // Replace with actual DB instance
}