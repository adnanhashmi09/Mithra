package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mh *MongoHandler) InitBrand(filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	upsert := true
	opts := options.UpdateOptions{
		Upsert: &upsert,
	}

	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := brandCollection.UpdateOne(ctx, filter, update, &opts)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (mh *MongoHandler) GetSingleBrand(brand *Brand, filter interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	err := brandCollection.FindOne(ctx, filter).Decode(brand)

	return err
}

func (mh *MongoHandler) UpdateBrand(filter interface{}, update interface{}) (*mongo.SingleResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result := brandCollection.FindOneAndUpdate(ctx, filter, update)
	if result.Err() != nil {
		return nil, result.Err()
	}

	return result, nil
}
