package routes

import (
	"github.com/gofiber/fiber/v2"
	"Todo/models"
	"github.com/golang-jwt/jwt/v4"
	"time"
)

var userCrud = models.NewUsersCrud()

// Function to create JWT token
func createToken(user models.Users) (string, error) {
	claims := jwt.MapClaims{
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"role":      user.Role,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Token expiration time
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("your_secret_key")) // Replace with your actual secret key
}

// ------- APIS Sections -------


// Create User
func createUser(c *fiber.Ctx) error {
	var user models.Users // User type declaration

	// Check if the request body params is empty
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Invalid input", 
			"output": []interface{}{}
		})
	}

	// Check if email is missing
	email := c.Params("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Check if user exists
	exists, err := userCrud.CheckUserByEmail(email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"returncode": 500, 
			"message": err.Error(), 
			"output": []interface{}{}
		})
	}

	if exists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "User already exists", 
			"output": []interface{}{}
		})
	}

	// Create new user
	response, err := userCrud.CreateUser(user)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	// Return success response
	return c.JSON(response)
}

// Login User
func loginUser(c *fiber.Ctx) error {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Checking Parameters
	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Invalid input", 
			"output": []interface{}{}
		})
	}

	if loginData.Email == "" || loginData.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Check if user exists
	exists, err := userCrud.CheckUserByEmail(loginData.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"returncode": 500, 
			"message": err.Error(), 
			"output": []interface{}{}
		})
	}

	if !exists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "User not found", 
			"output": []interface{}{}
		})
	}

	// Login user
	response, err := userCrud.LoginUser(loginData.Email, loginData.Password)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	if response["returncode"].(int) == 200 {
		userData := response["output"].(models.Users)
		token, err := createToken(userData)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"returncode": 500,
				"message": "Failed to create token", 
				"output": []interface{}{}
			})
		}

		// Set the token in an HTTP-only cookie
		c.Cookie(&fiber.Cookie{
			Name:     "auth_token",
			Value:    token,
			HTTPOnly: true,
			Secure:   false, // Set to true if using HTTPS
			SameSite: fiber.CookieSameSiteLax,
			Path:     "/",
		})
	}

	return c.JSON(response)
}


// Update Password
func updatePassword(c *fiber.Ctx) error {
	var data struct {
		Email       string `json:"email"`
		NewPassword string `json:"newPassword"`
	}

	// Check if the request body params is empty
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Invalid input", 
			"output": []interface{}{}
		})
	}

	if data.Email == "" || data.NewPassword == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Check if user exists
	exists, err := userCrud.CheckUserByEmail(data.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"returncode": 500, 
			"message": err.Error(), 
			"output": []interface{}{}
		})
	}

	if !exists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "User not found", 
			"output": []interface{}{}
		})
	}

	// Update password
	response, err := userCrud.UpdatePassword(data.Email, data.NewPassword)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}


// Delete User
func deleteUser(c *fiber.Ctx) error {
	// Check if the request body params is empty
	email := c.Params("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Check if user exists
	exists, err := userCrud.CheckUserByEmail(email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"returncode": 500, 
			"message": err.Error(), 
			"output": []interface{}{}
		})
	}	

	if !exists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "User not found", 
			"output": []interface{}{}
		})
	}

	// Delete user
	response, err := userCrud.DeleteUser(email)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}


// Read Users
func readUsers(c *fiber.Ctx) error {

	// Read all users
	response, err := userCrud.ReadUsers()
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// Read Single User
func readUser(c *fiber.Ctx) error {

	// Check if the request body params is empty
	email := c.Params("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Read user
	response, err := userCrud.ReadUser(email)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// Check User by Email
func checkUserByEmail(c *fiber.Ctx) error {
	email := c.Params("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Check if user exists
	exists, err := userCrud.CheckUserByEmail(email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"returncode": 500, 
			"message": err.Error(), 
			"output": []interface{}{}
		})
	}

	return c.JSON(fiber.Map{
		"returncode": 200, 
		"exists": exists, 
		"output": []interface{}{}
	})
}

// Update User
func updateUser(c *fiber.Ctx) error {
	
	// Check if the request body params is empty
	userID := c.Params("id")
	var updateData models.Users
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Invalid input", 
			"output": []interface{}{}
		})
	}

	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"returncode": 400, 
			"message": "Missing required parameters", 
			"output": []interface{}{}
		})
	}

	// Update user
	response, err := userCrud.UpdateUser(userID, updateData)
	if err != nil {
		return c.Status(response["returncode"].(int)).JSON(response)
	}

	return c.JSON(response)
}

// SetupRoutes function to register the routes
func SetupRoutes(app *fiber.App) {
	app.Post("/api/users", createUser)
	app.Post("/api/users/login", loginUser)
	app.Put("/api/users/password", updatePassword)
	app.Delete("/api/users/:email", deleteUser)
	app.Get("/api/users", readUsers)
	app.Get("/api/users/:email", readUser)
	app.Get("/api/users/check/:email", checkUserByEmail)
	app.Put("/api/users/:id", updateUser)
}