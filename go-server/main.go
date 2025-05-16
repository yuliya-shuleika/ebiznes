package main

import (
	"github.com/labstack/echo/v4"
	"go-server/db"
	"go-server/handlers"
	"go-server/models"
)

func main() {
	e := echo.New()

	db.ConnectDB()
	db.DB.AutoMigrate(&models.Product{})

	e.GET("/products", handlers.GetProducts)
	e.GET("/products/:id", handlers.GetProduct)
	e.POST("/products", handlers.CreateProduct)
	e.PUT("/products/:id", handlers.UpdateProduct)
	e.DELETE("/products/:id", handlers.DeleteProduct)

	e.GET("/cart/:key", handlers.GetCartItems)
	e.POST("/cart/:key/items", handlers.AddCartItem)
	e.DELETE("/cart/:key/items/:productId", handlers.RemoveCartItem)
	e.DELETE("/cart/:key", handlers.ClearCart)

	
	e.Logger.Fatal(e.Start(":8080"))
}
