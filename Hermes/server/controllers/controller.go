package controllers

import (
	"hermes.com/db"
	"hermes.com/utils"
)

type Key string

type Response struct {
	Status  string `json:"status"`
	Success bool   `json:"success"`
}

var (
	mh *db.MongoHandler
	// s3b               *db.S3Bucket
	mongoDbConnection string
	pinata_key        string
	pinata_secret     string
	// aws_region        string
	// aws_key           string
	// aws_secret        string
	// s3_bucket         string
)

func ControllersInit() {
	pinata_key = utils.Dotenv("PINATA_API_KEY")
	pinata_secret = utils.Dotenv("PINATA_API_SECRET")

	// 	aws_region = utils.Dotenv("AWS_REGION")
	// 	aws_key = utils.Dotenv("AWS_ACCESS_KEY")
	// 	aws_secret = utils.Dotenv("AWS_ACCESS_SECRET")
	// s3_bucket = utils.Dotenv("TOKEN_BUCKET_NAME")
	// s3b, _ = db.NewS3Session(aws_region, aws_key, aws_secret, s3_bucket)

	mongoDbConnection = utils.Dotenv("DB_URI")
	mh, _ = db.NewMongoHandler(mongoDbConnection)
}
