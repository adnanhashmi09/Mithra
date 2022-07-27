package controllers

import (
	"github.com/hermes/db"
)

type Response struct {
	Status string `json:"status"`
}

var (
	mh 				  *db.MongoHandler
	mongoDbConnection string

)

func ControllersInit() {

	mongoDbConnection = "Hello"
	mh, _ = db.NewMongoHandler(mongoDbConnection)
}
