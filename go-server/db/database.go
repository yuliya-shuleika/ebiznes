package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("products.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Cannot connect to database:", err)
	}
}
