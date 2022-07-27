package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoHandler struct {
	client   *mongo.Client
	database string
}

var (
	defaultDB = "CryptoChasm"
	TimeOut   = time.Second * 10
)

var (
	mh              *MongoHandler
	tokenCollection *mongo.Collection
	brandCollection *mongo.Collection
)

func NewMongoHandler(address string) (*MongoHandler, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cl, err := mongo.Connect(ctx, options.Client().ApplyURI(address))
	if err != nil {
		log.Println(err)
		return nil, err
	}

	err = cl.Ping(ctx, readpref.Primary())

	if err != nil {
		log.Println(err)
		return nil, err
	} else {
		log.Println("Connected to MongoDB")
	}

	mh = &MongoHandler{
		client:   cl,
		database: defaultDB,
	}

	brandCollection = mh.client.Database(mh.database).Collection("brands")
	tokenCollection = mh.client.Database(mh.database).Collection("tokens")

	return mh, nil
}
