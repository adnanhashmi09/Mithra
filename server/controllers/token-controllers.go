package controllers

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"warranty.com/db"
	"warranty.com/utils"
)

type TokenArr struct {
	Approved   []*db.Token `json:"approved,omitempty"`
	Unapproved []*db.Token `json:"unapproved,omitempty"`
}

type TokenResponse struct {
	Status   string    `json:"status,omitempty"`
	Failure  bool      `json:"failure,omitempty"`
	Tokens   *TokenArr `json:"tokens,omitempty"`
	Response db.Token  `json:"response,omitempty"`
	Nonce    string    `json:"nonce,omitempty"`
}

func GetTokensByBrand(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	tokens := mh.GetTokens(bson.M{"brand": token.Brand})

	approved := []*db.Token{}
	unapproved := []*db.Token{}

	for _, token := range tokens {
		if token.ApprovalStatus {
			approved = append(approved, token)
		} else {
			unapproved = append(unapproved, token)
		}
	}

	result := &TokenArr{
		Approved:   approved,
		Unapproved: unapproved,
	}

	json.NewEncoder(w).Encode(TokenResponse{
		Status:  "success",
		Failure: false,
		Tokens:  result,
	})
}

func GetToken(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	var filter bson.M
	if token.ProductId == "" {
		filter = bson.M{
			"name":     token.Name,
			"metaHash": token.MetaHash,
		}
	} else {
		filter = bson.M{
			"productId": token.ProductId,
		}
	}

	err := mh.GetSingleToken(token, filter)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(token)
}

func ApproveToken(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	presentToken := &db.Token{}
	err := mh.GetSingleToken(presentToken, bson.M{"productId": token.ProductId})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	address := fmt.Sprint(r.Context().Value(Key("address")))
	if token.MetaHash == "" {
		metaRsp, err := MintToken(token)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}
		token.MetaHash = metaRsp.IpfsHash
		token.MintedOn = metaRsp.Timestamp
		token.Minter = address
	}

	if token.Minter != address {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	token.Transactions = append(token.Transactions, presentToken.Transactions...)
	token.Transactions = append(token.Transactions, token.Approval)
	token.ApprovalStatus = true

	_, err = mh.ReplaceToken(token, bson.M{"metaHash": token.MetaHash})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:  "success",
			Failure: false,
		},
	)
}

func RegisterToken(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	presentToken := &db.Token{}
	err := mh.GetSingleToken(presentToken, bson.M{"productId": token.ProductId})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			metaRsp, err := MintToken(token)
			if err != nil {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}
			token.MetaHash = metaRsp.IpfsHash
			token.MintedOn = metaRsp.Timestamp
		} else {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
	}

	token.Transactions = append(token.Transactions, presentToken.Transactions...)
	token.ApprovalStatus = false

	_, err = mh.ReplaceToken(token, bson.M{"metaHash": token.MetaHash})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:  "success",
			Failure: false,
		},
	)
}

// GetTokenNonce fetches the nonce associated to the ethereum address of the brand
func GetTokenNonce(w http.ResponseWriter, r *http.Request) {
	filter := db.Token{}
	json.NewDecoder(r.Body).Decode(&filter)

	token := db.Token{}
	err := mh.GetSingleToken(&token, filter)
	if err != nil {
		http.Error(w, fmt.Sprintln(err), http.StatusBadRequest)
		return
	}

	nonce := token.Nonce
	nonceHex := hex.EncodeToString([]byte(nonce))

	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:  "success",
			Failure: false,
			Nonce:   nonceHex,
		},
	)
}

func MintToken(tk *db.Token) (*utils.IpfsRsp, error) {
	tokenMetadata := &utils.IpfsMetadata{
		Name:           tk.Name,
		ProductId:      tk.ProductId,
		Description:    tk.Description,
		Brand:          tk.Brand,
		TokenURI:       tk.TokenURI,
		WarrantyPeriod: tk.Period,
	}
	metaRsp, err := utils.PinJSONToIPFS(tokenMetadata, pinata_key, pinata_secret)
	if err != nil {
		return nil, err
	}
	return metaRsp, err
}

func GenTokenNonce(ethAddress string) (string, error) {
	result := db.Brand{}
	var oldNonce string

	nonce, err := genNonce()
	if err != nil {
		return oldNonce, err
	}

	filter := bson.M{"ethAddress": ethAddress}
	updateResult, err := mh.UpdateSingleToken(filter, bson.M{"$set": bson.M{"nonce": nonce}})
	if err != nil {
		return oldNonce, err
	}

	err = updateResult.Decode(&result)
	if err != nil {
		return oldNonce, err
	}

	oldNonce = result.Nonce
	return oldNonce, nil
}
