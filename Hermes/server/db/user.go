package db

type User struct {
	EthAddress string `json:"ethAddress" bson:"ethAddress"`
	Nonce      string `json:"nonce" bason:"nonce"`
}
