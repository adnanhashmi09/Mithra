package routes

import (
	"github.com/go-chi/chi"
	"hermes.com/controllers"
)

func UserRoutes(r chi.Router) {
	r.Get("/nonce/{ethaddress}", controllers.GetUserNonce)
}
