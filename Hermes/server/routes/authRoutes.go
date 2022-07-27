package routes

import (
	"github.com/go-chi/chi"
	"github.com/hermes/controllers"
)

func AuthRoutes(r chi.Router){
	r.Post("/{ethAddress}", controllers.VerifySignature)
}