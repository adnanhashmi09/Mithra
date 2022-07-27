package routes

import (
	"github.com/go-chi/chi"
	"warranty.com/controllers"
)

func TokenRoutes(r chi.Router) {
	r.Get("/all", controllers.GetTokensByBrand)
	r.Post("/approve", controllers.ApproveToken)
	r.Post("/approve/{productid}", controllers.ApproveToken)
}
