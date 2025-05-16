package models

import "gorm.io/gorm"

type CartItem struct {
	gorm.Model
	CartKey   string   `gorm:"index" json:"cart_key"`     // Identifier of the cart
	ProductID uint     `json:"product_id"`
	Quantity  uint     `json:"quantity"`
	Product   Product  `json:"product"` // For preload
}

func ScopeByCartKey(key string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("cart_key = ?", key)
	}
}

func ScopeByCartKeyAndProduct(cartKey string, productID uint) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("cart_key = ? AND product_id = ?", cartKey, productID)
	}
}
