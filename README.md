# NgTestnetWallet
Bitcoin Web Wallet for Testnet that uses Angular, Express, Mongo DB.

![view](https://user-images.githubusercontent.com/62182298/88649140-951bfa80-d102-11ea-816b-e3e333ffbfb8.gif)

## Demo
This is a DEMO: <https://ng-testnet-wallet.herokuapp.com/>

Note: If the server is in sleep mode, it will take longer to boot.

## Using the app for dev
1. [Genarate database on MongoDB Atlas and get db URI](https://www.mongodb.com/cloud/atlas) (Used to save users).
1. [Get BLOCK CYPHER API key](https://www.blockcypher.com/) (Used to get address information and push Tx).
1. [Get CoinMarketCap API key](https://coinmarketcap.com/api/) (Used to get BTC price).
1. Genarate two 256bit keys(Used to sign of jwt and encrypt private key).
1. Create `dev.js` file in `/server/config` and add:

```golang:dev.js
        module.exports = {
          DB_URI: "DB URI",
          SECRET: "256bit key",
          KEY: "256bit key",
          BC_TOKEN: " BLOCK CYPHER TOKEN",
          CMC_TOKEN: "CMC TOKEN"
        }
```
1. Run `npm install`
1. Run `npm run start-dev` for a frontend server.
1. Run `npm run express` for a backend server.
1. Open your browser on `http://localhost:4200/`

## Using the app for prod
1. Set the environment variable in the hosting service with the key written in `/server/config/prod.js` and add a value.
1. Run `ng build --prod`

## Environment
+ Angular CLI version 10.0.0.
* express version ^4.17.1.
+ mongoose version ^5.9.21.

