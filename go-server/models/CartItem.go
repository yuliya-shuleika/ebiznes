package models

import "gorm.io/gorm"

type CartItem struct {
	gorm.Model
	CartKey   string   `gorm:"index" json:"cart_key"`     // Identifier of the cart
	ProductID uint     `json:"product_id"`
	Quantity  uint     `json:"quantity"`
	Product   Product  `json:"product"` // For preload
}
