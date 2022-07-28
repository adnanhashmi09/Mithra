package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"go.mongodb.org/mongo-driver/bson"
	"hermes.com/db"
)

type ProductArr struct {
	Approved   []*db.Product `json:"approved,omitempty"`
	Unapproved []*db.Product `json:"unapproved,omitempty"`
}

type ProductResponse struct {
	Status   string      `json:"status,omitempty"`
	Failure  bool        `json:"failure,omitempty"`
	Tokens   *ProductArr `json:"tokens,omitempty"`
	Response db.Product  `json:"response,omitempty"`
	Nonce    string      `json:"nonce,omitempty"`
}

func GetProductsByUser(w http.ResponseWriter, r *http.Request) {
	prod := &db.Product{}
	json.NewDecoder(r.Body).Decode(&prod)

	products := mh.GetProducts(bson.M{"owner": prod.Owner})

	approved := []*db.Product{}
	unapproved := []*db.Product{}

	for _, product := range products {
		if product.ApprovalStatus {
			approved = append(approved, product)
		} else {
			unapproved = append(unapproved, product)
		}
	}

	result := &ProductArr{
		Approved:   approved,
		Unapproved: unapproved,
	}

	json.NewEncoder(w).Encode(ProductResponse{
		Status:  "success",
		Failure: false,
		Tokens:  result,
	})
}

func SaleProduct(w http.ResponseWriter, r *http.Request) {
	prod := &db.Product{}
	json.NewDecoder(r.Body).Decode(&prod)

	update := bson.M{"$set": bson.M{"forSale": true}}
	_, err := mh.UpdateProduct(bson.M{"productId": prod.ProductId}, update)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(ProductResponse{
		Status:  "success",
		Failure: false,
	})
}

func GetProduct(w http.ResponseWriter, r *http.Request) {
	productId := chi.URLParam(r, "productid")

	product := &db.Product{}
	err := mh.GetSingleProduct(product, bson.M{"productId": productId})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(product)
}

func BuyProduct(w http.ResponseWriter, r *http.Request) {
	prod := &db.Product{}
	json.NewDecoder(r.Body).Decode(&prod)

	product := &db.Product{}
	err := mh.GetSingleProduct(product, bson.M{"productId": prod.ProductId})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	product.Approval = prod.Approval
	payload, err := json.Marshal(product)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	// TODO(): Change URL in prod
	client := &http.Client{}
	req, err := http.NewRequest("POST", "https://localhost:5050/api/token/approve", bytes.NewReader(payload))
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	rsp, _ := client.Do(req)
	if rsp.StatusCode != http.StatusOK {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(ProductResponse{
		Status:  "success",
		Failure: false,
	})
}
