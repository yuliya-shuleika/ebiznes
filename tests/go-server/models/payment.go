package models

import (
	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Total        float64 `json:"total"`
	Status       string  `json:"status"`
	CreditCardNo string  `json:"credit_card_no"`
	ExpiryDate   string  `json:"expiry_date"`
	CVV          string  `json:"cvv"`
}
