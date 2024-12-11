package models

import (
	"context"
	"github.com/go-kivik/kivik/v3"
	"log"
)

type Todo struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

type TodoCrud struct {
	db *kivik.DB
}

func NewTodoCrud(db *kivik.DB) *TodoCrud {
	return &TodoCrud{db: db}
}

// Create a new Todo
func (crud *TodoCrud) Create(todo Todo) (map[string]interface{}, error) {
	_, err := crud.db.Put(context.Background(), todo.ID, todo)
	if err != nil {
		log.Printf("Error creating Todo: %v", err)
		return map[string]interface{}{
			"returncode": 500,
			"message":    "Failed to create Todo",
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Todo created successfully",
		"output":     todo,
	}, nil
}

// Read a Todo by ID
func (crud *TodoCrud) Read(id string) (map[string]interface{}, error) {
	var todo Todo
	err := crud.db.Get(context.Background(), id, &todo)
	if err != nil {
		log.Printf("Error reading Todo: %v", err)
		return map[string]interface{}{
			"returncode": 404,
			"message":    "Todo not found",
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Todo retrieved successfully",
		"output":     todo,
	}, nil
}

// Update a Todo
func (crud *TodoCrud) Update(todo Todo) (map[string]interface{}, error) {
	_, err := crud.db.Put(context.Background(), todo.ID, todo)
	if err != nil {
		log.Printf("Error updating Todo: %v", err)
		return map[string]interface{}{
			"returncode": 500,
			"message":    "Failed to update Todo",
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Todo updated successfully",
		"output":     todo,
	}, nil
}

// Delete a Todo
func (crud *TodoCrud) Delete(id string) (map[string]interface{}, error) {
	_, err := crud.db.Delete(context.Background(), "todos", id)
	if err != nil {
		log.Printf("Error deleting Todo: %v", err)
		return map[string]interface{}{
			"returncode": 500,
			"message":    "Failed to delete Todo",
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Todo deleted successfully",
		"output":     nil,
	}, nil
}

// List all Todos
func (crud *TodoCrud) List() (map[string]interface{}, error) {
	var todos []Todo
	// Fetch all todos logic here (e.g., using a view or query)
	// For simplicity, this is left as a placeholder.
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Todos retrieved successfully",
		"output":     todos,
	}, nil
}