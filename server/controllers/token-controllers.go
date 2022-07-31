package controllers

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"warranty.com/db"
	"warranty.com/utils"
)

type TokenArr struct {
	Approved   []*db.Token `json:"approved"`
	Unapproved []*db.Token `json:"unapproved"`
}

type TokenResponse struct {
	Status   string    `json:"status,omitempty"`
	Failure  bool      `json:"failure,omitempty"`
	Brand    string    `json:"brand,omitempty"`
	Tokens   *TokenArr `json:"tokens,omitempty"`
	Response db.Token  `json:"response,omitempty"`
	Nonce    string    `json:"nonce,omitempty"`
}

func GetTokensByBrand(w http.ResponseWriter, r *http.Request) {
	brand := &db.Brand{}

	address := r.Context().Value(Key("address")).(string)

	log.Println("Brand address {}", address)
	err := mh.GetSingleBrand(brand, bson.M{"ethAddress": address})
	fmt.Println("error", err)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	tokens := mh.GetTokens(bson.M{"brandAddress": address})

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

	log.Println(brand.Name)

	json.NewEncoder(w).Encode(TokenResponse{
		Status:  "success",
		Failure: false,
		Tokens:  result,
		Brand:   brand.Name,
	})
}

func GetTokensByOwner(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(token)

	if token.Owner == "" {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	filter := bson.M{"$or": []bson.M{{"owner": token.Owner}, {"approval.to": token.Owner}}}
	tokens := mh.GetTokens(filter)

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
			"saleDate": token.SaleDate,
			"owner":    token.Owner,
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

func AddApprovedToken(w http.ResponseWriter, r *http.Request) {
	address := r.Context().Value(Key("address"))

	token := db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	presentToken := &db.Token{}
	err := mh.GetSingleToken(presentToken, bson.M{"productId": token.ProductId})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	if presentToken.Minter != address {
		fmt.Println("Not the minter")
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	approval := presentToken.Approval
	approval.TxnHash = token.Approval.TxnHash

	if token.TokenId != 0 {
		presentToken.TokenId = token.TokenId
	}

	presentToken.Owner = presentToken.Approval.To
	presentToken.Transactions = append(presentToken.Transactions, approval)
	presentToken.ApprovalStatus = true
	presentToken.Approval = db.Transaction{}

	_, err = mh.ReplaceToken(presentToken, bson.M{"productId": token.ProductId})
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	mssg := fmt.Sprintf(
		`Your token for product ID: %s, and IPFS Hash: %s has been approved. 
		You can now avail warranty benefits. This warranty will expire in %d days`,
		presentToken.ProductId, presentToken.MetaHash, presentToken.Period,
	)
	err = sendMail(approval.Email, mssg)
	if err != nil {
		log.Println("unable to send email")
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:   "success",
			Failure:  false,
			Response: token,
		},
	)

}

func ApproveToken(w http.ResponseWriter, r *http.Request) {

	address := r.Context().Value(Key("address")).(string)

	token := db.Token{}

	json.NewDecoder(r.Body).Decode(&token)
	err := mh.GetSingleToken(&token, bson.M{"productId": token.ProductId})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if token.MetaHash == "" {
		metaRsp, err := MintToken(&token, address)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}
		token.MetaHash = metaRsp.IpfsHash
		token.MintedOn = metaRsp.Timestamp
		token.Minter = address

		filter := bson.M{"productId": token.ProductId}
		update := bson.M{"$set": bson.M{
			"metaHash": metaRsp.IpfsHash,
			"mintedOn": metaRsp.Timestamp,
			"minter":   address,
			"tokenId":  token.TokenId}}

		_, err = mh.UpdateSingleToken(filter, update)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:   "success",
			Failure:  false,
			Response: token,
		},
	)
}

func RegisterToken(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	presentToken := &db.Token{}
	err := mh.GetSingleToken(presentToken, bson.M{"productId": token.ProductId})
	if err != nil && err != mongo.ErrNoDocuments {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	if presentToken.MetaHash == "" {
		if token.Owner == "" {
			token.Approval.From = token.BrandAddress
			token.Owner = token.BrandAddress
		}
		// token.Transactions = append(token.Transactions, presentToken.Transactions...)
		token.ApprovalStatus = false

		nonce, _ := genNonce()
		token.Nonce = nonce

		_, err = mh.ReplaceToken(token, bson.M{"productId": token.ProductId})
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

	} else {
		presentToken.Approval = token.Approval
		presentToken.Email = token.Email
		presentToken.SaleDate = token.SaleDate
		presentToken.ApprovalStatus = false

		_, err = mh.ReplaceToken(presentToken, bson.M{"productId": token.ProductId})
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:  "success",
			Failure: false,
		},
	)
}

func SetClaim(w http.ResponseWriter, r *http.Request) {
	token := &db.Token{}
	json.NewDecoder(r.Body).Decode(&token)

	address := r.Context().Value(Key("address")).(string)

	filter := bson.M{"productId": token.ProductId}
	presentToken := &db.Token{}
	err := mh.GetSingleToken(presentToken, filter)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	if presentToken.Owner != address {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	_, err = mh.UpdateSingleToken(filter, bson.M{"$set": bson.M{"claim": token.Claim}})
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
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
	// filter := db.Token{}
	// json.NewDecoder(r.Body).Decode(&filter)

	productId := chi.URLParam(r, "productId")
	log.Println("=============", productId)

	token := db.Token{}
	err := mh.GetSingleToken(&token, bson.M{"productId": productId})
	if err != nil {
		http.Error(w, fmt.Sprintln(err), http.StatusBadRequest)
		return
	}

	nonce := token.Nonce
	log.Println("=====nonce========", nonce)

	nonceHex := hex.EncodeToString([]byte(nonce))

	json.NewEncoder(w).Encode(
		TokenResponse{
			Status:  "success",
			Failure: false,
			Nonce:   nonceHex,
		},
	)
}

func MintToken(tk *db.Token, address string) (*utils.IpfsRsp, error) {
	tokenMetadata := &utils.IpfsMetadata{
		Name:           tk.Name,
		ProductId:      tk.ProductId,
		Description:    tk.Description,
		Brand:          tk.Brand,
		TokenURI:       tk.TokenURI,
		WarrantyPeriod: tk.Period,
		Minter:         address,
	}
	metaRsp, err := utils.PinJSONToIPFS(tokenMetadata, pinata_key, pinata_secret)

	if err != nil {
		fmt.Println("Error ====> ", err)
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

	filter := bson.M{"owner": ethAddress}
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
