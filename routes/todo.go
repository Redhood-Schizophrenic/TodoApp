package routes

import (
	"github.com/gofiber/fiber/v2"
	"Todo/models"
	"Todo/config"
)

// Create Todo
func createTodo(c *fiber.Ctx) error {

	// Check Params
	var todo models.Todo
	if err := c.BodyParser(&todo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Invalid input", 
			"output": []interface{}{}
		})
	}

	if (todo.Title == "" || todo.Description == "") {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Create Todo
	response, err := config.GetTodoCrud().Create(todo)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}


// Read Todo
func readTodo(c *fiber.Ctx) error {
	// Check Params
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Read Todo
	response, err := config.GetTodoCrud().Read(id)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// Update Todo
func updateTodo(c *fiber.Ctx) error {
	// Check Params
	var todo models.Todo
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	if err := c.BodyParser(&todo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"returncode": 400, "message": "Invalid input", "output": []interface{}{}})
	}
	todo.ID = id // Set the ID for the Todo

	// Update Todo
	response, err := config.GetTodoCrud().Update(todo)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// Delete Todo
func deleteTodo(c *fiber.Ctx) error {
	// Check Params
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Delete Todo
	response, err := config.GetTodoCrud().Delete(id)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// List Todos
func listTodos(c *fiber.Ctx) error {
	// List Todos
	response, err := config.GetTodoCrud().List()
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// SetupRoutes function to register the routes
func SetupTodoRoutes(app *fiber.App) {
	app.Post("/api/todos", createTodo)
	app.Get("/api/todos/:id", readTodo)
	app.Put("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)
	app.Get("/api/todos", listTodos)
}