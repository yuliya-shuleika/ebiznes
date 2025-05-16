package handlers

import (
	"net/http"
	"go-server/db"
	"go-server/models"
	"github.com/labstack/echo/v4"
)

func CreateCategory(c echo.Context) error {
	var category models.Category
	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	db.DB.Create(&category)
	return c.JSON(http.StatusCreated, category)
}

func GetCategories(c echo.Context) error {
	var categories []models.Category
	db.DB.Scopes(models.ScopeWithProduct()).Find(&categories)
	return c.JSON(http.StatusOK, categories)
}
