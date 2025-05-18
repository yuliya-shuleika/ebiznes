package main

import (
	"go-server/db"
	"go-server/handlers"
	"go-server/models"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

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

	e.POST("/payments", handlers.CreatePayment)
	e.GET("/payments", handlers.GetPayments)

	e.Logger.Fatal(e.Start(":8080"))
}
