package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`

	CategoryID  uint     `json:"category_id"`           // FK
	Category    Category `json:"category"`              // relacja 1:N
}
