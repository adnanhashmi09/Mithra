package db

import (
	"time"
)

type Transaction struct {
	Event   string `json:"event" bson:"event"`
	Date    string `json:"date" bson:"date"`
	From    string `json:"from" bson:"from"`
	To      string `json:"to" bson:"to"`
	Email   string `json:"email" bson:"email"`
	Price   string `json:"price,omitempty" bson:"price,omitempty"`
	TxnId   string `json:"txnId" bson:"txnId"`
	TxnHash string `json:"txnHash" bson:"txnHash"`
}

type Token struct {
	Name            string        `json:"name" bson:"name"`
	Owner           string        `json:"owner" bson:"owner"`
	TokenId         string        `json:"tokenId" bson:"tokenId"`
	Nonce           string        `json:"nonce" bson:"nonce"`
	ProductId       string        `json:"productId" bson:"productId"`
	Brand           string        `json:"brand" bson:"brand"`
	BrandAddress    string        `json:"brandAddress" bson:"brandAddress"`
	ContractAddress string        `json:"contractAddress" bson:"contractAddress"`
	MetaHash        string        `json:"metaHash" bson:"metaHash"`
	TokenURI        string        `json:"tokenUri" bson:"tokenUri"`
	Minter          string        `json:"minter,omitempty" bson:"minter,omitempty"`
	MintedOn        time.Time     `json:"mintedOn" bson:"mintedOn"`
	Period          time.Duration `json:"period" bson:"period"`
	Description     string        `json:"description" bson:"description"`
	ForSale         bool          `json:"forSale" bson:"forSale"`
	Approval        Transaction   `json:"approval" bson:"approval"`
	ApprovalStatus  bool          `json:"approvalStatus" bson:"approvalStatus"`
	Transactions    []Transaction `json:"transactions" bson:"transactions"`
	SaleDate        string        `json:"saleDate" bson:"saleDate"`
	Email           string        `json:"email" bson:"email"`
}
