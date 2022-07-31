package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mh *MongoHandler) GetTokens(filter interface{}) []*Token {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut*2)
	defer cancel()

	cur, err := tokenCollection.Find(ctx, filter)
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)

	tokens := []*Token{}
	for cur.Next(ctx) {
		token := &Token{}
		err = cur.Decode(token)

		if err != nil {
			log.Println(err)
		}

		tokens = append(tokens, token)
	}

	return tokens
}

func (mh *MongoHandler) GetSingleToken(NFT *Token, filter interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	err := tokenCollection.FindOne(ctx, filter).Decode(NFT)

	return err
}

func (mh *MongoHandler) ReplaceToken(NFT *Token, filter interface{}) (*mongo.UpdateResult, error) {
	upsert := true
	opts := options.ReplaceOptions{
		Upsert: &upsert,
	}

	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := tokenCollection.ReplaceOne(ctx, filter, NFT, &opts)

	return result, err
}

func (mh *MongoHandler) AddToken(NFT *Token) (*mongo.InsertOneResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := tokenCollection.InsertOne(ctx, NFT)

	return result, err
}

func (mh *MongoHandler) UpdateToken(filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	upsert := true
	opts := options.UpdateOptions{
		Upsert: &upsert,
	}

	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := tokenCollection.UpdateOne(ctx, filter, update, &opts)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (mh *MongoHandler) UpdateSingleToken(filter interface{}, update interface{}) (*mongo.SingleResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result := tokenCollection.FindOneAndUpdate(ctx, filter, update)
	if result.Err() != nil {
		return nil, result.Err()
	}

	return result, nil
}

func (mh *MongoHandler) DeleteToken(filter interface{}) (*mongo.DeleteResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := tokenCollection.DeleteOne(ctx, filter)

	return result, err
}
