package routes

import (
	"github.com/go-chi/chi"
	"warranty.com/controllers"
)

func UserRoutes(r chi.Router) {
	r.Get("/{ethaddress}", controllers.GetByAddress)
	r.Get("/nonce/{ethaddress}", controllers.GetBrandNonce)
	r.Post("/edit/{ethaddress}", controllers.EditBrand)
	r.Get("/init/{ethaddress}", controllers.InitialiseBrand)
}
