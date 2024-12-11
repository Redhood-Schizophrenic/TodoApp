package models

import (
	"context"
	"log" // Import log package
	"github.com/go-kivik/kivik/v3"
)

type BaseCrud struct {
	db *kivik.DB // Reference to the Kivik DB
}

// Create a new document
func (b *BaseCrud) Create(data interface{}, docID string) (map[string]interface{}, error) {
	_, err := b.db.Put(context.Background(), docID, data)
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Document created successfully",
		"output":     data,
	}, nil
}

// Read multiple documents based on filters
func (b *BaseCrud) ReadMany(filters map[string]interface{}) (map[string]interface{}, error) {
	rows, err := b.db.Find(context.Background(), filters)
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	defer rows.Close()

	var docs []map[string]interface{}
	for rows.Next() {
		var doc map[string]interface{}
		if err := rows.ScanDoc(&doc); err != nil {
			return map[string]interface{}{
				"returncode": 500,
				"message":    err.Error(),
				"output":     nil,
			}, err
		}
		docs = append(docs, doc)
	}

	return map[string]interface{}{
		"returncode": 200,
		"message":    "Documents fetched successfully",
		"output":     docs,
	}, nil
}

// Read a single document by ID
func (b *BaseCrud) ReadOne(docID string) (map[string]interface{}, error) {
	row, err := b.db.Get(context.Background(), docID)
	if err != nil {
		if kivik.IsNotFound(err) {
			return map[string]interface{}{
				"returncode": 404,
				"message":    "Document not found",
				"output":     nil,
			}, nil
		}
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	var data map[string]interface{}
	if err := row.ScanDoc(&data); err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Document retrieved successfully",
		"output":     data,
	}, nil
}

// Update a document
func (b *BaseCrud) Update(docID string, data interface{}) (map[string]interface{}, error) {
	_, err := b.db.Put(context.Background(), docID, data)
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Document updated successfully",
		"output":     data,
	}, nil
}

// Delete a document
func (b *BaseCrud) Delete(docID string, rev string) (map[string]interface{}, error) {
	_, err := b.db.Delete(context.Background(), docID, rev) // Provide revision
	if err != nil {
		log.Printf("Error deleting document: %v", err)
		return map[string]interface{}{
			"returncode": 500,
			"message":    "Failed to delete document",
			"output":     nil,
		}, err
	}
	return map[string]interface{}{
		"returncode": 200,
		"message":    "Document deleted successfully",
		"output":     nil,
	}, nil
}

// Check if document exists
func (b *BaseCrud) Exists(docID string) (bool, error) {
	_, err := b.db.Get(context.Background(), docID)
	if err != nil {
		if kivik.IsNotFound(err) {
			return false, nil // Document does not exist
		}
		return false, err // Some other error occurred
	}
	return true, nil // Document exists
}

// Count documents based on filters
func (b *BaseCrud) Count(filters map[string]interface{}) (map[string]interface{}, error) {
	rows, err := b.db.Find(context.Background(), filters)
	if err != nil {
		return map[string]interface{}{
			"returncode": 500,
			"message":    err.Error(),
			"output":     0,
		}, err
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		count++
	}

	return map[string]interface{}{
		"returncode": 200,
		"message":    "Count retrieved successfully",
		"output":     count,
	}, nil
}