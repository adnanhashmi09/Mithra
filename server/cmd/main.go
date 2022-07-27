package main

import (
	"log"
	"net/http"

	"warranty.com/routes"
)

func main() {
	r := routes.RouterInit()
	log.Println("Starting server on Port: 5050")
	log.Fatal(http.ListenAndServe(":5050", r))
}
