package db

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"go-server/models"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("products1.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Cannot connect to database:", err)
	}

	DB.AutoMigrate(&models.Product{}, &models.CartItem{}, &models.Payment{})
}
