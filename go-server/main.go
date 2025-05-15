package main

import (
	"github.com/labstack/echo/v4"
	"go-server/handlers"
)

func main() {
	e := echo.New()

	e.GET("/products", handlers.GetProducts)
	e.GET("/products/:id", handlers.GetProduct)
	e.POST("/products", handlers.CreateProduct)
	e.PUT("/products/:id", handlers.UpdateProduct)
	e.DELETE("/products/:id", handlers.DeleteProduct)

	e.Logger.Fatal(e.Start(":8080"))
}
