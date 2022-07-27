package db

type Brand struct {
	EthAddress  string  `json:"ethAddress" bson:"ethAddress"`
	Nonce       string  `json:"nonce" bson:"nonce"`
	Name        string  `json:"name,omitempty" bson:"name,omitempty"`
	Description string  `json:"decription,omitempty" bson:"descrption,omitempty"`
	Email       string  `json:"email,omitempty" bson:"email,omitempty"`
	TokenSymbol string  `json:"tokenSymbol" bson:"tokenSymbol"`
	TokenName   string  `json:"tokenName" bson:"tokenName"`
	ContractAbi string  `json:"contractAbi" bson:"contractAbi"`
	Tokens      []Token `json:"tokens" bson:"token"`
}
