package controllers

import (
	"crypto/rand"
	"math/big"
	"mime/multipart"
	"net"
	"net/http"
	"net/smtp"
	"strconv"

	"warranty.com/utils"
)

type FormMultipart struct {
	File        multipart.File
	FileHead    *multipart.FileHeader
	Minter      string
	Description string
	Name        string
}

func ProcessMultipart(r *http.Request) (FormMultipart, error) {
	err := r.ParseMultipartForm(20 << 20) // max upload size 20 MB
	if err != nil {
		return FormMultipart{}, err
	}

	file, fileHead, err := r.FormFile("file")
	if err != nil {
		return FormMultipart{}, err
	}

	formData := FormMultipart{
		File:        file,
		FileHead:    fileHead,
		Minter:      r.PostFormValue("minter"),
		Description: r.PostFormValue("description"),
		Name:        r.PostFormValue("name"),
	}

	return formData, nil
}

func genNonce() (string, error) {
	randNonce, err := rand.Int(rand.Reader, big.NewInt(100000))
	if err != nil {
		return "", err
	}

	nonce := int(randNonce.Int64())

	return strconv.Itoa(nonce), nil
}

func sendMail(email string, message string) error {
	toList := []string{email}

	host := utils.Dotenv("SMTP_HOST")
	port := utils.Dotenv("SMTP_PORT")
	from := utils.Dotenv("SMTP_ID")
	pass := utils.Dotenv("SMTP_PASS")

	body := []byte(message)
	auth := smtp.PlainAuth("", from, pass, host)
	err := smtp.SendMail(net.JoinHostPort(host, port), auth, from, toList, body)
	return err
}
