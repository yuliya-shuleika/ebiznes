package models

import (
	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	CartKey    string  `json:"cart_key"`
	Total      float64 `json:"total"`
	Status     string  `json:"status"`
}
