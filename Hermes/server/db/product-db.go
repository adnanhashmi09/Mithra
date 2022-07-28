package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mh *MongoHandler) GetProducts(filter interface{}) []*Product {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut*2)
	defer cancel()

	cur, err := productCollection.Find(ctx, filter)
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)

	products := []*Product{}
	for cur.Next(ctx) {
		product := &Product{}
		err = cur.Decode(product)

		if err != nil {
			log.Fatal(err)
		}

		products = append(products, product)
	}

	return products
}

func (mh *MongoHandler) GetSingleProduct(prod *Product, filter interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	err := productCollection.FindOne(ctx, filter).Decode(prod)

	return err
}

func (mh *MongoHandler) ReplaceProduct(prod *Product, filter interface{}) (*mongo.UpdateResult, error) {
	upsert := true
	opts := options.ReplaceOptions{
		Upsert: &upsert,
	}

	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := productCollection.ReplaceOne(ctx, filter, prod, &opts)

	return result, err
}

func (mh *MongoHandler) AddProduct(prod *Product) (*mongo.InsertOneResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := productCollection.InsertOne(ctx, prod)

	return result, err
}

func (mh *MongoHandler) UpdateProduct(filter interface{}, update interface{}) (*mongo.SingleResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result := productCollection.FindOneAndUpdate(ctx, filter, update)
	if result.Err() != nil {
		return nil, result.Err()
	}

	return result, nil
}

func (mh *MongoHandler) DeleteProduct(filter interface{}) (*mongo.DeleteResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), TimeOut)
	defer cancel()

	result, err := productCollection.DeleteOne(ctx, filter)

	return result, err
}
