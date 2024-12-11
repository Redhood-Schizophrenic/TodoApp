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

	// Set up routes
	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
