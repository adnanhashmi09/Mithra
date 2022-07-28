package routes

import (
	"github.com/go-chi/chi"
	"hermes.com/controllers"
	"hermes.com/middleware"
)

func TokenRoutes(r chi.Router) {
	r.Group(func(r chi.Router) {
		r.Use(middleware.VerifyUser)
		r.Get("/all", controllers.GetProductsByUser)
		r.Post("/all", controllers.SaleProduct)
		r.Post("/buy", controllers.BuyProduct) //
	})
	r.Post("/{productid}", controllers.GetProduct)
}
