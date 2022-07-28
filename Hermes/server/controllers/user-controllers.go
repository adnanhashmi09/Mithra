package controllers

import (
	"encoding/hex"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"go.mongodb.org/mongo-driver/bson"
	"hermes.com/db"
)

type userResponse struct {
	Status   string  `json:"status,omitempty"`
	Failure  bool    `json:"failure,omitempty"`
	Response db.User `json:"response,omitempty"`
	Nonce    string  `json:"nonce,omitempty"`
}

// GetuserNonce fetches the nonce associated to the ethereum address of the brand
func GetUserNonce(w http.ResponseWriter, r *http.Request) {
	ethAddress := chi.URLParam(r, "ethaddress")
	if ethAddress == "" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	user := &db.User{}
	err := mh.GetSingleUser(user, bson.M{"ethAddress": ethAddress})
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	nonce := user.Nonce
	nonceHex := hex.EncodeToString([]byte(nonce))

	json.NewEncoder(w).Encode(
		userResponse{
			Status: "nonce received",
			Nonce:  nonceHex,
		},
	)
}

func GenUserNonce(ethAddress string) (string, error) {
	result := db.User{}
	var oldNonce string

	nonce, err := genNonce()
	if err != nil {
		return oldNonce, err
	}

	filter := bson.M{"ethAddress": ethAddress}
	updateResult, err := mh.UpdateUser(filter, bson.M{"$set": bson.M{"nonce": nonce}})
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
