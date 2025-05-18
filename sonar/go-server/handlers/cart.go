package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"go-server/db"
	"go-server/models"

	"github.com/labstack/echo/v4"
)

func GetCartItems(c echo.Context) error {
	cartKey := c.Param("key")

	var count int64
	if err := db.DB.Model(&models.CartItem{}).Where("cart_key = ?", cartKey).Count(&count).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Database error"})
	}
	if count == 0 {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "No cart items found for this key"})
	}

	var items []models.CartItem
	err := db.DB.Scopes(models.ScopeByCartKey(cartKey)).Find(&items).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, items)
}

type RequestBody struct {
	ProductID uint `json:"product_id"`
	Quantity  uint `json:"quantity"`
}

func AddCartItem(c echo.Context) error {
	cartKey := c.Param("key")

	var body RequestBody
	decoder := json.NewDecoder(c.Request().Body)
	decoder.DisallowUnknownFields() // Helps catch unknown fields or malformed JSON

	if err := decoder.Decode(&body); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request: " + err.Error(),
		})
	}

	var product models.Product
	if err := db.DB.First(&product, body.ProductID).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
	}

	var item models.CartItem
	result := db.DB.Scopes(models.ScopeByCartKeyAndProduct(cartKey, body.ProductID)).First(&item)
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
	productIDParam, _ := strconv.Atoi(c.Param("productId"))
	productID := uint(productIDParam)

	var item models.CartItem
	if err := db.DB.Scopes(models.ScopeByCartKeyAndProduct(cartKey, productID)).First(&item).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found in cart"})
	}

	err := db.DB.Scopes(models.ScopeByCartKeyAndProduct(cartKey, productID)).Delete(&models.CartItem{}).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Item removed"})
}

func ClearCart(c echo.Context) error {
	cartKey := c.Param("key")

	var count int64
	if err := db.DB.Model(&models.CartItem{}).Where("cart_key = ?", cartKey).Count(&count).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Database error"})
	}
	if count == 0 {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "No cart items found for this key"})
	}

	err := db.DB.Scopes(models.ScopeByCartKey(cartKey)).Delete(&models.CartItem{}).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Cart cleared"})
}
