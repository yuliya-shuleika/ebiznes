package handlers

import (
	"go-server/db"
	"go-server/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type PaymentRequest struct {
	Total 		 string `json:"total"`
	CreditCardNo string  `json:"credit_card_no"`
	ExpiryDate   string  `json:"expiry_date"`
	CVV          string  `json:"cvv"`
}

func CreatePayment(c echo.Context) error {
	var req PaymentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": err.Error()})
	}

	// Simulate successful payment logic
	total, err := strconv.ParseFloat(req.Total, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid total amount"})
	}

	payment := models.Payment{
		Total:        total,
		Status:       "paid",
		CreditCardNo: req.CreditCardNo,
		ExpiryDate:   req.ExpiryDate,
		CVV:          req.CVV,
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
