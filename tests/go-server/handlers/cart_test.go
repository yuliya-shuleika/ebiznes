package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"go-server/db"
	"go-server/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetCartItems_NotFound(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodGet, "/cart/cart123", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key")
	c.SetParamValues("test-key")

	err := GetCartItems(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestGetCartItems(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	cartKey := "cart123"
	db.DB.Create(&models.CartItem{CartKey: cartKey, ProductID: 1, Quantity: 3})

	req := httptest.NewRequest(http.MethodGet, "/cart/"+cartKey, nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key")
	c.SetParamValues(cartKey)

	err := GetCartItems(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var items []models.CartItem
	err = json.Unmarshal(rec.Body.Bytes(), &items)
	assert.NoError(t, err)
	assert.Len(t, items, 1)
	assert.Equal(t, uint(3), items[0].Quantity)
}

func TestAddCartItem_InvalidBody(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{"productIdewjjweq": "invalid", "quantity": 2}`)
	req := httptest.NewRequest(http.MethodPost, "/cart/test-key", bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key")
	c.SetParamValues("test-key")

	_ = AddCartItem(c)

	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "invalid request")
}

func TestAddCartItem_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{
		Name:        "Test Product",
		Description: "Test Description",
		Price:       100,
		Picture:     "test.jpg",
	}
	db.DB.Create(&product)
	db.DB.Create(&models.CartItem{
		CartKey:   "cart123",
		ProductID: product.ID,
		Quantity:  3,
	})

	body := []byte(fmt.Sprintf(`{"product_id": %d, "quantity": 2}`, product.ID))
	req := httptest.NewRequest(http.MethodPost, "/cart/cart123", bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.SetParamNames("key")
	c.SetParamValues("cart123")

	err := AddCartItem(c)
	if assert.NoError(t, err) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
	var cartItems []models.CartItem
	result := db.DB.Where("cart_key = ? AND product_id = ?", "cart123", product.ID).Find(&cartItems)
	assert.NoError(t, result.Error)
	assert.Len(t, cartItems, 1)
	assert.Equal(t, uint(5), cartItems[0].Quantity)
}

func TestRemoveCartItem_NotFound(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodDelete, "/cart/test-key/1", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key", "productId")
	c.SetParamValues("test-key", "1")

	err := RemoveCartItem(c)
	if assert.NoError(t, err) {
		assert.Equal(t, http.StatusNotFound, rec.Code)
	}
}

func TestRemoveCartItem_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{
		Name:        "Test Product",
		Description: "Test Description",
		Price:       100,
		Picture:     "test.jpg",
	}
	db.DB.Create(&product)
	cartItem := models.CartItem{
		CartKey:   "cart123",
		ProductID: product.ID,
		Quantity:  2,
	}
	db.DB.Create(&cartItem)

	req := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/cart/cart123/%d", product.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key", "productId")
	c.SetParamValues("cart123", fmt.Sprintf("%d", product.ID))

	err := RemoveCartItem(c)
	if assert.NoError(t, err) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}

func TestClearCart_NotFound(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodDelete, "/cart/nonexistent-key", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key")
	c.SetParamValues("nonexistent-key")

	err := ClearCart(c)
	if assert.NoError(t, err) {
		assert.Equal(t, http.StatusNotFound, rec.Code)
		assert.Contains(t, rec.Body.String(), "No cart items found for this key")
	}
}

func TestClearCart_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	cartKey := "cart-to-clear"
	db.DB.Create(&models.CartItem{CartKey: cartKey, ProductID: 1, Quantity: 2})
	db.DB.Create(&models.CartItem{CartKey: cartKey, ProductID: 2, Quantity: 1})

	req := httptest.NewRequest(http.MethodDelete, "/cart/"+cartKey, nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("key")
	c.SetParamValues(cartKey)

	err := ClearCart(c)
	if assert.NoError(t, err) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "Cart cleared")
	}

	var count int64
	db.DB.Model(&models.CartItem{}).Where("cart_key = ?", cartKey).Count(&count)
	assert.Equal(t, int64(0), count)
}
