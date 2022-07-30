package controllers

import (
	"crypto/rand"
	"fmt"
	"log"
	"math/big"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
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

func sendMail(email string, mssg string) error {
	from := mail.NewEmail("Team Comders", "team.comders@gmail.com")
	subject := "Mithra: Warranty token update"
	to := mail.NewEmail("Recipient", email)
	plainTextContent := mssg
	htmlContent := fmt.Sprintf("<strong>%s</strong>", mssg)
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient("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")
	response, err := client.Send(message)
	log.Println(response.StatusCode)
	return err
}
