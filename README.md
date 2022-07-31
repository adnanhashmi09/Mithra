# मिthra: Blockhain-based Product Assurance Platform

- Github link: https://github.com/adnanhashmi09/warranty

## Use-cases

मिthra provides end-to-end product assurance services allowing us to leverage blockchain technology to guarantee safeguard of products. 

- Allow brands to provide warranty without a centralized system. This ensures warranties cannot be modified once minted. 

- Allow brands to authenticate customers via soulbound NFTs, without the need for the user to pay gas fees.

- Allow customers to re-sell bought products keeping warranties intact for future use.

- Allow both parties to keep track of warranty status and other related services, as well as communicating concerns to the producer.

- Allow brands and e-commerce platforms to increase trust by providing tamper-less product assurance.

## What we provide
- A platform for producers/brands: Brands can deploy smart contract to keep track of their products, approve warranty requests and verify client claims. It is important to note that the brand has only powers limited to approval. If a company decides to elongate this process, it loses credibility. Hence, the process is incentivized.

- An API for e-commerce platforms: We provide an API for e-commerce platforms allowing them to integrate our services with their existing codebase. This provides an SDK-like workflow allowing easy and smooth provision of services.

- An API client: We built Hermes, a mock e-commerce platform that uses our API to demonstrate the buying and selling process

## Running the project 

To run this project follow the below steps:

- To run the next.js client server for मिthra UI:
```
cd ./client
yarn install // install dependencies
yarn dev
```

- To start the Go server:
```
cd ./server
go mod tidy // install dependencies
cd ./cmd
go run main.go
```
starts the server on `port:5050`

- To start the `hermes` e-commerce client:

```
cd ./hermes/client
yarn install // install dependencies
yarn dev
```
