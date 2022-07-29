package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"warranty.com/controllers"
)

// var (
// 	NonceGenerator = map[string]func(string) (string, error){
// 		"brand": controllers.GenBrandNonce,
// 		"token": controllers.GenTokenNonce,
// 	}
// )

type Auth struct {
	Signature  string `json:"signature,omitempty"`
	EthAddress string `json:"ethAddress"`
	// UserType   string `json:"userType"`
}

func VerifyAddress(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			body, _ := r.GetBody()
			auth := Auth{}
			json.NewDecoder(body).Decode(&auth)

			data, err := controllers.GenBrandNonce(auth.EthAddress)
			if err != nil {
				http.Error(w, fmt.Sprintln(err), http.StatusBadRequest)
				return
			}

			sigByte := hexutil.MustDecode(auth.Signature)
			if sigByte[64] != 27 && sigByte[64] != 28 {
				http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
				return
			}
			sigByte[64] -= 27

			message := fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(data), data)
			publicKey, err := crypto.SigToPub(crypto.Keccak256([]byte(message)), sigByte)
			log.Println(publicKey)
			if err != nil {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
				return
			}

			derivedAddress := crypto.PubkeyToAddress(*publicKey).String()
			log.Println(derivedAddress)
			pubAddress := strings.ToLower(derivedAddress)
			if pubAddress != auth.EthAddress {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), controllers.Key("address"), pubAddress)
			next.ServeHTTP(w, r.WithContext(ctx))
		},
	)
}
