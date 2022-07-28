package main

import (
	"log"
	"net/http"

	"hermes.com/routes"
)

func main() {
	r := routes.RouterInit()
	log.Println("Starting server on Port: 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
