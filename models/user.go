package models

import (
	"log"
	"golang.org/x/crypto/bcrypt"
	"github.com/go-kivik/kivik/v3"
)

type Users struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UsersCrud struct {
	BaseCrud
}

// NewUsersCrud initializes a new UsersCrud instance
func NewUsersCrud(db *kivik.DB) *UsersCrud {
	return &UsersCrud{
		BaseCrud: BaseCrud{db: db}, // Pass the Kivik DB instance to BaseCrud
	}
}

// Create new user
func (crud *UsersCrud) CreateUser(userData Users) (map[string]interface{}, error) {
	// Hash the password before saving
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userData.Password), bcrypt.DefaultCost)
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	userData.Password = string(hashedPassword)

	// Create the user in the database
	result, err := crud.Create(userData, userData.Email) // Use email as the document ID
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	return result, nil
}

// Login user
func (crud *UsersCrud) LoginUser(email, password string) (map[string]interface{}, error) {
	user, err := crud.ReadUser(email)
	if err != nil {
		return map[string]interface{}{
			"returncode": 401,
			"message":    "Invalid credentials",
			"output":     nil,
		}, err
	}

	// Compare the provided password with the stored hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user["password"].(string)), []byte(password)); err != nil {
		return map[string]interface{}{
			"returncode": 401,
			"message":    "Invalid credentials",
			"output":     nil,
		}, err
	}

	return map[string]interface{}{
		"returncode": 200,
		"message":    "Login successful",
		"output":     user,
	}, nil
}

// Update password
func (crud *UsersCrud) UpdatePassword(email, newPassword string) (map[string]interface{}, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}

	// Update user data with the new password
	userData := Users{Password: string(hashedPassword)}
	result, err := crud.Update(email, userData)
	if err != nil {
		return result, err
	}
	return result, nil
}

// Delete user
func (crud *UsersCrud) DeleteUser(email string) (map[string]interface{}, error) {
	result, err := crud.Delete(email)
	if err != nil {
		return result, err
	}
	return result, nil
}

// Read all users
func (crud *UsersCrud) ReadUsers() (map[string]interface{}, error) {
	// Implement logic to read all users
	return crud.ReadMany(map[string]interface{}{"type": "user"}) // Assuming we filter by type
}

// Read a single user by email
func (crud *UsersCrud) ReadUser(email string) (map[string]interface{}, error) {
	return crud.ReadOne(email) // Use email as the document ID
}

// Check if user exists by email
func (crud *UsersCrud) CheckUserByEmail(email string) (bool, error) {
	return crud.Exists(email) // Use email as the document ID
}

// Update user
func (crud *UsersCrud) UpdateUser(userID string, updateData Users) (map[string]interface{}, error) {
	return crud.Update(userID, updateData) // Use userID as the document ID
}

// User authentication
func (crud *UsersCrud) AuthenticateUser(email, password string) (map[string]interface{}, error) {
	return crud.LoginUser(email, password) // Reusing the LoginUser method
}