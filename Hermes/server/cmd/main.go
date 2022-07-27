package main

import (
	"log"
	"net/http"
)

func main(){
	
	log.Printf("Starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}