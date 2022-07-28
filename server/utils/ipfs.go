package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"time"
)

type IpfsRsp struct {
	IpfsHash  string    `json:"ipfsHash"`
	PinSize   int64     `json:"pinSize"`
	Timestamp time.Time `json:"timestamp"`
}

type IpfsMetadata struct {
	Name           string        `json:"name"`
	ProductId      string        `json:"productId"`
	Description    string        `json:"description"`
	Minter         string        `json:"minter"`
	Brand          string        `json:"brand"`
	TokenURI       string        `json:"tokenUri"`
	WarrantyPeriod time.Duration `json:"warrantyPeriod"`
}

func PinFileToIPFS(file *multipart.FileHeader, api_key string, api_secret string) (*IpfsRsp, error) {
	ipfs := &IpfsRsp{}
	client := &http.Client{}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	fw, err := writer.CreateFormFile("file", "ArtNFT")
	if err != nil {
		log.Println(err)
		return ipfs, err
	}

	f, err := file.Open()
	if err != nil {
		log.Println(err)
		return ipfs, err
	}

	fileContent, err := ioutil.ReadAll(f)
	if err != nil {
		log.Println(err)
		return ipfs, err
	}

	fw.Write(fileContent)
	writer.Close()

	req, err := http.NewRequest("POST", "https://api.pinata.cloud/pinning/pinFileToIPFS", bytes.NewReader(body.Bytes()))
	if err != nil {
		log.Println(err)
		return ipfs, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("pinata_api_key", api_key)
	req.Header.Set("pinata_secret_api_key", api_secret)

	rsp, _ := client.Do(req)
	if rsp.StatusCode != http.StatusOK {
		log.Println("bad status code")
		return ipfs, errors.New(rsp.Status)
	}

	json.NewDecoder(rsp.Body).Decode(ipfs)

	return ipfs, nil
}

func PinJSONToIPFS(metadata *IpfsMetadata, api_key string, api_secret string) (*IpfsRsp, error) {
	ipfs := &IpfsRsp{}
	client := &http.Client{}

	payload := new(bytes.Buffer)
	json.NewEncoder(payload).Encode(metadata)

	req, err := http.NewRequest("POST", "https://api.pinata.cloud/pinning/pinJSONToIPFS", payload)
	if err != nil {
		log.Println(err)
		return ipfs, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("pinata_api_key", api_key)
	req.Header.Set("pinata_secret_api_key", api_secret)

	rsp, _ := client.Do(req)
	if rsp.StatusCode != http.StatusOK {
		log.Println(err)
		return ipfs, errors.New(rsp.Status)
	}

	json.NewDecoder(rsp.Body).Decode(ipfs)

	return ipfs, nil
}
