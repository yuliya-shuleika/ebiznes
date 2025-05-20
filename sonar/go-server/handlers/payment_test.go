package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"go-server/db"
	"go-server/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

const paymentsRoute = "/payments"

func TestCreatePaymentWithInvalidBody(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{"total": "abc", "credit_card_no": "1234", "expiry_date": "12/25", "cvv": "123"}`)
	req := httptest.NewRequest(http.MethodPost, paymentsRoute, bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreatePayment(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid total amount")
}

func TestCreatePaymentWithInvalidJSON(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{invalid json}`)
	req := httptest.NewRequest(http.MethodPost, paymentsRoute, bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreatePayment(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestCreatePaymentSuccess(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	body := []byte(`{
		"total": "150.75",
		"credit_card_no": "4111111111111111",
		"expiry_date": "12/25",
		"cvv": "123"
	}`)
	req := httptest.NewRequest(http.MethodPost, paymentsRoute, bytes.NewBuffer(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreatePayment(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var payment models.Payment
	err = json.Unmarshal(rec.Body.Bytes(), &payment)
	assert.NoError(t, err)
	assert.Equal(t, 150.75, payment.Total)
	assert.Equal(t, "paid", payment.Status)
	assert.Equal(t, "4111111111111111", payment.CreditCardNo)
}

func TestGetPaymentsEmpty(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	req := httptest.NewRequest(http.MethodGet, paymentsRoute, nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := GetPayments(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var payments []models.Payment
	err = json.Unmarshal(rec.Body.Bytes(), &payments)
	assert.NoError(t, err)
	assert.Len(t, payments, 0)
}

func TestGetPaymentsWithData(t *testing.T) {
	setupTestDB()
	e := setupEcho()

	payment := models.Payment{
		Total:        99.99,
		Status:       "paid",
		CreditCardNo: "1234567890123456",
		ExpiryDate:   "01/30",
		CVV:          "321",
	}
	db.DB.Create(&payment)

	req := httptest.NewRequest(http.MethodGet, paymentsRoute, nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := GetPayments(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var payments []models.Payment
	err = json.Unmarshal(rec.Body.Bytes(), &payments)
	assert.NoError(t, err)
	assert.Len(t, payments, 1)
	assert.Equal(t, 99.99, payments[0].Total)
	assert.Equal(t, "paid", payments[0].Status)
}
