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
	"hermes.com/controllers"
)

var (
	NonceGenerator = map[string]func(string) (string, error){
		"brand": controllers.GenUserNonce,
	}
)

type Auth struct {
	Signature  string `json:"signature,omitempty"`
	EthAddress string `json:"ethAddress"`
	UserType   string `json:"userType"`
}

func VerifyUser(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			auth := Auth{}
			json.NewDecoder(r.Body).Decode(&auth)

			data, err := NonceGenerator[auth.UserType](auth.EthAddress)
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
			if err != nil {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
				return
			}

			derivedAddress := crypto.PubkeyToAddress(*publicKey).String()
			pubAddress := strings.ToLower(derivedAddress)

			if pubAddress != auth.EthAddress {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), controllers.Key("user"), pubAddress)
			next.ServeHTTP(w, r.WithContext(ctx))
		},
	)
}
