package db

import (
	"bytes"
	"fmt"
	"log"
	"mime/multipart"
	"net/url"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type S3Bucket struct {
	region    string
	bucket    string
	s3session *session.Session
}

func NewS3Session(aws_region string, aws_key string, aws_secret string, bucket_name string) (*S3Bucket, error) {
	s3session, err := session.NewSession(&aws.Config{
		Region:      aws.String(aws_region),
		Credentials: credentials.NewStaticCredentials(aws_key, aws_secret, ""),
	})

	if err != nil {
		log.Fatal(err)
		return nil, err
	} else {
		log.Println("AWS session initialised")
	}

	s3b := &S3Bucket{
		region:    aws_region,
		bucket:    bucket_name,
		s3session: s3session,
	}

	return s3b, nil
}

func (s3b *S3Bucket) UploadToken(file multipart.File, header *multipart.FileHeader, minter string) (string, error) {
	fileSize := header.Size
	buf := make([]byte, fileSize)
	file.Read(buf)

	filetype := filepath.Ext(header.Filename)[1:]
	fileName := fmt.Sprintf("token-%s-%s.%s", minter, time.Now().String(), filetype)

	s3session := s3b.s3session
	_, err := s3.New(s3session).PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(s3b.bucket), // set bucket name here
		Key:         aws.String(fileName),
		ACL:         aws.String("public-read"),
		ContentType: aws.String("image/" + filetype),
		Body:        bytes.NewReader(buf),
	})

	if err != nil {
		log.Println(err)
		return "", err
	}

	tokenURI := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s ", s3b.bucket, s3b.region, url.QueryEscape(fileName))

	return tokenURI, nil
}
