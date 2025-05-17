package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"go-server/db"
	"go-server/models"
)

func GetProducts(c echo.Context) error {
	var products []models.Product
	db.DB.Find(&products)
	return c.JSON(http.StatusOK, products)
}

func GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product
	result := db.DB.First(&product, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
	}
	return c.JSON(http.StatusOK, product)
}

func CreateProduct(c echo.Context) error {
	var product models.Product
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	db.DB.Create(&product)
	return c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product
	result := db.DB.First(&product, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
	}
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	db.DB.Save(&product)
	return c.JSON(http.StatusOK, product)
}

func DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product
	result := db.DB.First(&product, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
	}
	db.DB.Delete(&product)
	return c.NoContent(http.StatusNoContent)
}

func GetProductsByCategory(c echo.Context) error {
	categoryIDParam, _ := strconv.Atoi(c.Param("categoryId"))
	categoryID := uint(categoryIDParam)

	var products []models.Product
	result := db.DB.Scopes(models.ScopeByCategory(categoryID)).Find(&products)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "No products found for this category"})
	}
	return c.JSON(http.StatusOK, products)
}
