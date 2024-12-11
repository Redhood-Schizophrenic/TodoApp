package config

import (
	"context"
	_ "github.com/go-kivik/couchdb/v3"
	"github.com/go-kivik/kivik/v3"
	"log"
)

var db *kivik.DB

func Init() {
	client, err := kivik.New("couch", "http://localhost:5984/")
	if err != nil {
		log.Fatalf("Failed to connect to CouchDB: %v", err)
	}

	ctx := context.Background()
	db = client.DB(ctx, "todos")
	if db.Err() != nil {
		log.Fatalf("Failed to access database: %v", db.Err())
	}
}

func GetDB() *kivik.DB {
	return db
}
