## 作った目的
+ JavaScriptフレームワークを利用して、アプリケーション作りたかったから
+ SPAを作成してみたかったから
+ フレームワークを使用して、前回作成したウォレットアプリの改良版を作りたかったから
+ MEANを使ってアプリを作ってみたかったから

## 工夫した点
+ フロントエンドの開発に時間をかけたかったため、サーバーサイドは前回作成したコードを流用(一部改良)した
+ フォームはフロントエンド側でバリデーションをするようにした
+ 送金手数料の見積もりを出せるようにした
+ 送金の承認速度を選択できるようにした
+ websocketを利用して、送受信した際にリアルタイムで通知が出るようにした
+ 取引を確認する際に、送金の取引なのか、受信の取引なのか、送金額、受信額を判別できるようにした

## 反省点
+ BootstrapとAngular Material Designが相互に干渉して、デザインが崩れてしまうところがあった
+ Angularの理解不足で、Componentを作成しすぎてしまったと感じた。もっとServiceを利用して機能を共有できるところはするべきだった
+ 全体的に可読性の低いコードになってしまった。要所要所にコメントをつける癖が必要であると思った
+ テストコードの実装、CIの導入を行い一連の過程を自動化を行いたかった。今後実装したい
+ Rxjsの理解がもっと必要である

# NgTestnetWallet
Bitcoin Web Wallet for Testnet that uses Angular, Express, Mongo DB.

![view](https://user-images.githubusercontent.com/62182298/88649140-951bfa80-d102-11ea-816b-e3e333ffbfb8.gif)

## Demo
Demo: <https://ng-testnet-wallet.herokuapp.com/>

Note: If the server is in sleep mode, it will take longer to boot.

## Using the app for dev
1. [Create database on MongoDB Atlas and get database URI](https://www.mongodb.com/cloud/atlas) (Used to save users).
1. [Get BLOCK CYPHER API key](https://www.blockcypher.com/) (Used to get address information and push Tx).
1. [Get CoinMarketCap API key](https://coinmarketcap.com/api/) (Used to get BTC price).
1. Genarate two 256bit keys(Used to sign jwt and encrypt private key).
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

## Note
You can get tBTC with the link below:
+ [Yet Another Bitcoin Testnet Faucet! Bech32!](https://testnet-faucet.mempool.co/)
+ [Bitcoin Testnet Faucet](https://bitcoinfaucet.uo1.net/)

