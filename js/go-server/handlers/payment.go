package handlers

import (
	"go-server/db"
	"go-server/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type PaymentRequest struct {
	CartKey string  `json:"cart_key"`
	Total   float64 `json:"total"`
}

func CreatePayment(c echo.Context) error {
	var req PaymentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid payment data"})
	}

	payment := models.Payment{
		CartKey: req.CartKey,
		Total:   req.Total,
		Status:  "paid", // Simulate a successful payment
	}

	if err := db.DB.Create(&payment).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Could not process payment"})
	}

	return c.JSON(http.StatusCreated, payment)
}

func GetPayments(c echo.Context) error {
	var payments []models.Payment
	if err := db.DB.Find(&payments).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Could not retrieve payments"})
	}
	return c.JSON(http.StatusOK, payments)
}
