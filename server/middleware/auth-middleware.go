package middleware

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"warranty.com/controllers"
)

type Auth struct {
	Signature  string `json:"signature,omitempty"`
	EthAddress string `json:"ethAddress"`
	ProductId  string `json:"productId"`
	// UserType   string `json:"userType"`
}

func VerifyAddress(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			// body, _ := r.GetBody()

			//--------------------------------------
			auth := &Auth{}
			buf := bytes.NewBuffer(make([]byte, 0))
			reader := io.TeeReader(r.Body, buf)
			json.NewDecoder(reader).Decode(&auth)

			r.Body.Close()
			r.Body = ioutil.NopCloser(buf)

			log.Println(auth.EthAddress)
			data, err := controllers.GenBrandNonce(auth.EthAddress)

			// time.Sleep(1 * time.Second)

			if err != nil {
				http.Error(w, fmt.Sprintln(err), http.StatusBadRequest)
				return
			}

			log.Println(data)

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
				log.Println("pubAddress : ", pubAddress)
				log.Println("ethAddress  : ", auth.EthAddress)
				log.Println("Address does not match")
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), controllers.Key("address"), pubAddress)
			next.ServeHTTP(w, r.WithContext(ctx))
		},
	)
}
