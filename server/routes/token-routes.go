package routes

import (
	"github.com/go-chi/chi"
	"warranty.com/controllers"
	"warranty.com/middleware"
)

func TokenRoutes(r chi.Router) {
	r.Post("/single", controllers.GetToken)
	r.Group(func(r chi.Router) {
		r.Use(middleware.VerifyAddress)
		r.Get("/all", controllers.GetTokensByBrand)
		r.Post("/approve", controllers.ApproveToken)
	})
}
