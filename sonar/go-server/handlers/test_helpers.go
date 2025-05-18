package handlers

import (
	"go-server/db"
	"go-server/models"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	testDB, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.DB = testDB
	testDB.AutoMigrate(&models.Product{}, &models.CartItem{}, &models.Payment{})
	return testDB
}

func setupEcho() *echo.Echo {
	return echo.New()
}
