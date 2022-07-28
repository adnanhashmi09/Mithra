package routes

import (
	"github.com/go-chi/chi"
	"warranty.com/controllers"
)

func UserRoutes(r chi.Router) {
	r.Get("/nonce/{ethaddress}", controllers.GetBrandNonce)
	r.Get("/init/{ethaddress}", controllers.InitialiseBrand)
}
