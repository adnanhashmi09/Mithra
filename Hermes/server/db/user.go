package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	EthAddress string `json:"ethAddress" bson:"ethAddress"`
	Nonce      string `json:"nonce" bson:"nonce"`
}

func (mh *MongoHandler) UpdateUser(filter interface{}, update interface{}) (User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	updatedResult := User{}

	err := userCollection.FindOneAndUpdate(ctx, filter, update).Decode(&updatedResult)

	if err != nil {
		if err == mongo.ErrNoDocuments {

		}
	}

	return updatedResult, nil
}
