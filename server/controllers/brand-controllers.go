package controllers

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"go.mongodb.org/mongo-driver/bson"
	"warranty.com/db"
)

type brandResponse struct {
	Status   string   `json:"status,omitempty"`
	Failure  bool     `json:"failure,omitempty"`
	Response db.Brand `json:"response,omitempty"`
	Nonce    string   `json:"nonce,omitempty"`
}

func GetByAddress(w http.ResponseWriter, r *http.Request) {
	ethAddress := chi.URLParam(r, "ethaddress")
	if ethAddress == "" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	brand := &db.Brand{}
	err := mh.GetSingleBrand(brand, bson.M{"ethAddress": ethAddress})
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	json.NewEncoder(w).Encode(brand)
}

// IntialiseBrand registers a new brand with the DB
func InitialiseBrand(w http.ResponseWriter, r *http.Request) {
	ethAddress := chi.URLParam(r, "ethaddress")

	if ethAddress == "" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	brand := db.Brand{}
	json.NewDecoder(r.Body).Decode(&brand)

	filter := bson.M{"ethAddress": ethAddress}
	nonce, err := genNonce()
	brand.Nonce = nonce

	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	_, err = mh.InitBrand(filter, bson.M{"$set": brand})
	if err != nil {
		log.Println(err)
		http.Error(w, fmt.Sprintln(err), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		brandResponse{
			Status:  "success",
			Failure: false,
		},
	)
}

func EditBrand(w http.ResponseWriter, r *http.Request) {
	ethAddress := chi.URLParam(r, "ethaddress")

	if ethAddress == "" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	filter := bson.M{"ethAddress": ethAddress}
	update := db.Brand{}
	json.NewDecoder(r.Body).Decode(&update)

	_, err := mh.UpdateBrand(filter, bson.M{"$set": update})
	if err != nil {
		http.Error(w, fmt.Sprintln(err), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		brandResponse{
			Status: "brand Updated",
		},
	)
}

// GetBrandNonce fetches the nonce associated to the ethereum address of the brand
func GetBrandNonce(w http.ResponseWriter, r *http.Request) {
	ethAddress := chi.URLParam(r, "ethaddress")
	if ethAddress == "" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	brand := &db.Brand{}
	err := mh.GetSingleBrand(brand, bson.M{"ethAddress": ethAddress})
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	nonce := brand.Nonce
	nonceHex := hex.EncodeToString([]byte(nonce))

	json.NewEncoder(w).Encode(
		brandResponse{
			Status: "nonce received",
			Nonce:  nonceHex,
		},
	)
}

func GenBrandNonce(ethAddress string) (string, error) {
	result := db.Brand{}
	var oldNonce string

	nonce, err := genNonce()
	if err != nil {
		return oldNonce, err
	}

	filter := bson.M{"ethAddress": ethAddress}
	updateResult, err := mh.UpdateBrand(filter, bson.M{"$set": bson.M{"nonce": nonce}})
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
