package handlers

import (
	"net/http"
	"strconv"

	"go-server/db"
	"go-server/models"

	"github.com/labstack/echo/v4"
)

const productNotFoundMessage = "Product not found"

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
		return c.JSON(http.StatusNotFound, echo.Map{"message": productNotFoundMessage})
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
		return c.JSON(http.StatusNotFound, echo.Map{"message": productNotFoundMessage})
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
		return c.JSON(http.StatusNotFound, echo.Map{"message": productNotFoundMessage})
	}
	db.DB.Delete(&product)
	return c.NoContent(http.StatusNoContent)
}
