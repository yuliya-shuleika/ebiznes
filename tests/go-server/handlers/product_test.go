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

func TestGetProducts_Empty(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodGet, "/products", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := GetProducts(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var products []models.Product
	err = json.Unmarshal(rec.Body.Bytes(), &products)
	assert.NoError(t, err)
	assert.Len(t, products, 0)
}

func TestGetProducts_WithData(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{Name: "Prod1", Description: "Desc1", Price: 100, Picture: "pic.jpg"}
	db.DB.Create(&product)

	req := httptest.NewRequest(http.MethodGet, "/products", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := GetProducts(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var products []models.Product
	err = json.Unmarshal(rec.Body.Bytes(), &products)
	assert.NoError(t, err)
	assert.Len(t, products, 1)
	assert.Equal(t, "Prod1", products[0].Name)
}

func TestGetProduct_NotFound(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodGet, "/products/999", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("999")

	err := GetProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
	assert.Contains(t, rec.Body.String(), "Product not found")
}

func TestGetProduct_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{Name: "Prod1", Description: "Desc1", Price: 100, Picture: "pic.jpg"}
	db.DB.Create(&product)

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/products/%d", product.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprintf("%d", product.ID))

	err := GetProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var returnedProduct models.Product
	err = json.Unmarshal(rec.Body.Bytes(), &returnedProduct)
	assert.NoError(t, err)
	assert.Equal(t, product.Name, returnedProduct.Name)
}

func TestCreateProduct_InvalidBody(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{"name": "Test", "price": "invalid"}`)
	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreateProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestCreateProduct_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{"name": "New Product", "description": "Desc", "price": 150, "picture": "img.jpg"}`)
	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreateProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var product models.Product
	err = json.Unmarshal(rec.Body.Bytes(), &product)
	assert.NoError(t, err)
	assert.Equal(t, "New Product", product.Name)
}

func TestUpdateProduct_NotFound(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{"name": "Updated Name", "price": 200}`)
	req := httptest.NewRequest(http.MethodPut, "/products/999", bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("999")

	err := UpdateProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
	assert.Contains(t, rec.Body.String(), "Product not found")
}

func TestUpdateProduct_InvalidBody(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{Name: "Old Name", Description: "Old Desc", Price: 100, Picture: "old.jpg"}
	db.DB.Create(&product)

	body := []byte(`{"price": "invalid"}`)
	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/products/%d", product.ID), bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprintf("%d", product.ID))

	err := UpdateProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestUpdateProduct_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{Name: "Old Name", Description: "Old Desc", Price: 100, Picture: "old.jpg"}
	db.DB.Create(&product)

	body := []byte(`{"name": "New Name", "price": 250}`)
	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/products/%d", product.ID), bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprintf("%d", product.ID))

	err := UpdateProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var updatedProduct models.Product
	err = json.Unmarshal(rec.Body.Bytes(), &updatedProduct)
	assert.NoError(t, err)
	assert.Equal(t, "New Name", updatedProduct.Name)
	assert.Equal(t, 250.0, updatedProduct.Price)
}

func TestDeleteProduct_NotFound(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodDelete, "/products/999", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("999")

	err := DeleteProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
	assert.Contains(t, rec.Body.String(), "Product not found")
}

func TestDeleteProduct_Success(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	product := models.Product{Name: "ToDelete", Description: "Desc", Price: 100, Picture: "img.jpg"}
	db.DB.Create(&product)

	req := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/products/%d", product.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprintf("%d", product.ID))

	err := DeleteProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNoContent, rec.Code)

	var count int64
	db.DB.Model(&models.Product{}).Where("id = ?", product.ID).Count(&count)
	assert.Equal(t, int64(0), count)
}
