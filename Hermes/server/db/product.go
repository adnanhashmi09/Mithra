package db

import (
	"time"
)

type Transaction struct {
	Event   string `json:"event" bson:"event"`
	Date    string `json:"date" bson:"date"`
	From    string `json:"from" bson:"from"`
	To      string `json:"to" bson:"to"`
	Price   string `json:"price,omitempty" bson:"price,omitempty"`
	TxnId   string `json:"txnId" bson:"txnId"`
	TxnHash string `json:"txnHash" bson:"txnHash"`
}

type Product struct {
	Name           string        `json:"name" bson:"name"`
	Owner          string        `json:"owner" bson:"owner"`
	ProductId      string        `json:"productId" bson:"productId"`
	Brand          string        `json:"brand" bson:"brand"`
	TokenURI       string        `json:"tokenUri" bson:"tokenUri"`
	Period         time.Duration `json:"period" bson:"period"`
	Description    string        `json:"description" bson:"description"`
	ForSale        bool          `json:"forSale" bson:"forSale"`
	Approval       Transaction   `json:"approval" bson:"approval"`
	ApprovalStatus bool          `json:"approvalStatus" bson:"approvalStatus"`
}
