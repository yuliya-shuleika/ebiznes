package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"go-server/models"
)

var products = []models.Product{
	{ID: 1, Name: "Laptop", Price: 3000},
	{ID: 2, Name: "Telefon", Price: 1500},
	{ID: 3, Name: "Tablet", Price: 2000},
	{ID: 4, Name: "Smartwatch", Price: 800},
	{ID: 5, Name: "Monitor", Price: 1200},
}

func GetProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, products)
}

func GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for _, p := range products {
		if p.ID == id {
			return c.JSON(http.StatusOK, p)
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
}

func CreateProduct(c echo.Context) error {
	var newProduct models.Product
	if err := c.Bind(&newProduct); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	newProduct.ID = len(products) + 1
	products = append(products, newProduct)
	return c.JSON(http.StatusCreated, newProduct)
}

func UpdateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for i, p := range products {
		if p.ID == id {
			if err := c.Bind(&products[i]); err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}
			products[i].ID = id
			return c.JSON(http.StatusOK, products[i])
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
}

func DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for i, p := range products {
		if p.ID == id {
			products = append(products[:i], products[i+1:]...)
			return c.NoContent(http.StatusNoContent)
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
}
