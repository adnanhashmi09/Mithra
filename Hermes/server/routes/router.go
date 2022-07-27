package routes

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

func RouterInit() http.Handler{

	r := chi.NewRouter()
	r.Use(cors.Default().Handler)

	r.Route("auth", AuthRoutes)

	return r
}