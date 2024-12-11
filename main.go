package main

import (
	"Todo/config" // Importing config package
	"Todo/routes" // Importing routes package
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// Initialize configuration
	config.Init()

	// Serve static files
	app.Static("/", "./public")

	// Set up routes
	routes.SetupTodoRoutes(app)
	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":3000"))
}