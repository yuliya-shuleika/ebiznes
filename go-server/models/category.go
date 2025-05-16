package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name     string     `json:"name"`
	Products []Product  `json:"products"` // relacja 1:N
}

func ScopeWithProduct() func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Preload("Product")
	}
}
