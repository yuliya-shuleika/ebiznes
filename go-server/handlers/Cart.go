package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"go-server/db"
	"go-server/models"
)

func GetCartItems(c echo.Context) error {
	cartKey := c.Param("key")

	var items []models.CartItem
	err := db.DB.Preload("Product").Where("cart_key = ?", cartKey).Find(&items).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, items)
}

func AddCartItem(c echo.Context) error {
	cartKey := c.Param("key")

	var body struct {
		ProductID uint `json:"product_id"`
		Quantity  uint `json:"quantity"`
	}
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	var product models.Product
	if err := db.DB.First(&product, body.ProductID).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
	}

	var item models.CartItem
	result := db.DB.Where("cart_key = ? AND product_id = ?", cartKey, body.ProductID).First(&item)
	if result.Error == nil {
		item.Quantity += body.Quantity
		db.DB.Save(&item)
		return c.JSON(http.StatusOK, item)
	}

	newItem := models.CartItem{
		CartKey:   cartKey,
		ProductID: product.ID,
		Quantity:  body.Quantity,
	}
	db.DB.Create(&newItem)

	return c.JSON(http.StatusCreated, newItem)
}

func RemoveCartItem(c echo.Context) error {
	cartKey := c.Param("key")
	productID, _ := strconv.Atoi(c.Param("productId"))

	var item models.CartItem
	if err := db.DB.Where("cart_key = ? AND product_id = ?", cartKey, productID).First(&item).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found in cart"})
	}

	err := db.DB.Where("cart_key = ? AND product_id = ?", cartKey, productID).Delete(&models.CartItem{}).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Item removed"})
}

func ClearCart(c echo.Context) error {
	cartKey := c.Param("key")

	err := db.DB.Where("cart_key = ?", cartKey).Delete(&models.CartItem{}).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Cart cleared"})
}
