"use strict";

const express = require("express");
const router = express.Router();
const bitcoin = require("bitcoinjs-lib");
const rp = require("request-promise-native");
const crypto = require("crypto-js");
const moment = require("moment-timezone");
const User = require("../model/user");
const UserCtrl = require("../controllers/user");

const networkName = "testnet";
const network = bitcoin.networks[networkName];

const config = require("../config/index");

router.get("/:userId", UserCtrl.authMiddleware, async function (req, res) {
  const userId = req.params.userId;

  const foundUser = await User.findById(userId, function (err, foundUser) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "User error", detail: "問題が発生しました" }],
      });
    }

    if (!foundUser) {
      return res.status(422).send({
        errors: [{ title: "User error", detail: "ユーザーが見つかりません" }],
      });
    }

    return foundUser;
  });

  if (foundUser) {
    try {
      const address = foundUser.address;
      const options = {
        url:
          "https://api.blockcypher.com/v1/btc/test3/addrs/" +
          address +
          "/full?token=" +
          config.BC_TOKEN,
        method: "GET",
        json: true,
      };

      const data = await rp(options);
      const balance = data.final_balance;
      const numberConfirmed = data.final_n_tx;
      const numberUnconfirmed = data.unconfirmed_n_tx;
      const totalReceived = data.total_received;
      const totalSent = data.total_sent;
      const txs = data.txs;
      let confirmedTxs = [];
      let unconfirmedTxs = [];

      if (txs.length > 0) {
        organizeTxs(txs);
      }

      if (data.hasMore) {
        const txLength = data.txs.length;
        const lastTxHeight = data.txs[txLength - 1].block_height;
        const options = {
          url:
            "https://api.blockcypher.com/v1/btc/test3/addrs/" +
            address +
            "/full?token=" +
            config.BC_TOKEN +
            "&before=" +
            lastTxHeight,
          method: "GET",
          json: true,
        };

        const data2 = await rp(options);
        const txs = data2.txs;

        organizeTxs(txs);
      }

      const options2 = {
        url:
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1",
        method: "GET",
        qs: {
          convert: "JPY",
        },
        headers: {
          "X-CMC_PRO_API_KEY": config.CMC_TOKEN,
        },
        json: true,
        gzip: true,
      };

      const response = await rp(options2);
      const price = response.data[1].quote.JPY.price;
      const changeRatio = response.data[1].quote.JPY.percent_change_24h;

      const options3 = {
        url:
          "https://api.blockcypher.com/v1/btc/test3?token=" + config.BC_TOKEN,
        method: "GET",
        json: true,
      };

      const feeRates = await rp(options3);
      const highFee = feeRates.high_fee_per_kb;
      const mediumFee = feeRates.medium_fee_per_kb;
      const lowFee = feeRates.low_fee_per_kb;

      return res.json({
        address,
        balance,
        confirmedTxs,
        unconfirmedTxs,
        totalReceived,
        totalSent,
        numberConfirmed,
        numberUnconfirmed,
        price,
        changeRatio,
        highFee,
        mediumFee,
        lowFee,
      });

      function organizeTxs(txs) {
        for (let i = 0; i < txs.length; i++) {
          if (txs[i].confirmations > 0) {
            const txId = txs[i].hash;
            const confirmations =
              txs[i].confirmations > 6 ? "+6" : txs[i].confirmations;
            const confirmed = moment(txs[i].confirmed)
              .tz("Asia/Tokyo")
              .format("YYYY/MM/DD HH:mm");
            const inputs = txs[i].inputs;
            const outputs = txs[i].outputs;
            let type;
            let amount;
            let isSendTx = false;

            for (let i = 0; i < inputs.length; i++) {
              if (inputs[i].addresses.indexOf(address) != -1) {
                amount = -outputs[0].value;
                type = "send";
                isSendTx = true;
                i = inputs.length;
              }
            }

            if (!isSendTx) {
              for (let i = 0; i < outputs.length; i++) {
                if (outputs[i].addresses.indexOf(address) != -1) {
                  amount = outputs[i].value;
                  type = "receive";
                  i = outputs.length;
                }
              }
            }

            const tx = {
              txId,
              confirmations,
              confirmed,
              amount,
              type,
            };
            confirmedTxs.push(tx);
          } else {
            const txId = txs[i].hash;
            const received = moment(txs[i].received)
              .tz("Asia/Tokyo")
              .format("YYYY/MM/DD HH:mm");
            const inputs = txs[i].inputs;
            const outputs = txs[i].outputs;
            let type;
            let amount;
            let isSendTx = false;

            for (let i = 0; i < inputs.length; i++) {
              if (inputs[i].addresses.indexOf(address) != -1) {
                amount = -outputs[0].value;
                type = "send";
                isSendTx = true;
                i = inputs.length;
              }
            }

            if (!isSendTx) {
              for (let i = 0; i < outputs.length; i++) {
                if (outputs[i].addresses.indexOf(address) != -1) {
                  amount = outputs[i].value;
                  type = "receive";
                  i = outputs.length;
                }
              }
            }

            const tx = {
              txId,
              received,
              amount,
              type,
            };

            unconfirmedTxs.push(tx);

            unconfirmedTxs = filterBytxHash(unconfirmedTxs);
          }
        }
      }

      function filterBytxHash(array) {
        const itemTxIds = array.map((item) => {
          return item.txId;
        });
        return array.filter((item, index) => {
          return itemTxIds.indexOf(item.txId) === index;
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(422).send({
        errors: [{ title: "Request error", detail: "問題が発生しました" }],
      });
    }
  }
});

router.post("/:userId", UserCtrl.authMiddleware, async function (req, res) {
  const recipient = req.body.recipient;
  const amount = req.body.amount;
  const fee = req.body.fee;
  const perSatoshi = Math.floor(fee / 1000);
  const userId = req.params.userId;

  if (!recipient) {
    return res.status(422).send({
      errors: [
        { title: "Transaction error", detail: "宛先を入力してください" },
      ],
    });
  }

  if (!amount) {
    return res.status(422).send({
      errors: [
        { title: "Transaction error", detail: "送金金額を入力してください" },
      ],
    });
  }

  if (!fee) {
    return res.status(422).send({
      errors: [
        { title: "Transaction error", detail: "送金手数料を入力してください" },
      ],
    });
  }

  const foundUser = await User.findById(userId, function (err, foundUser) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "User error", detail: "問題が発生しました" }],
      });
    }

    if (!foundUser) {
      return res.status(422).send({
        errors: [{ title: "User error", detail: "ユーザーが見つかりません" }],
      });
    }

    return foundUser;
  });

  if (foundUser) {
    try {
      const sender = foundUser.address;
      const privateKey = foundUser.privateKey;

      const decryptedPk = crypto.AES.decrypt(privateKey, config.KEY).toString(
        crypto.enc.Utf8
      );

      const senderKeyPair = bitcoin.ECPair.fromWIF(decryptedPk, network);
      const txb = new bitcoin.TransactionBuilder(network);
      txb.setVersion(1);

      const utxoOptions = {
        url:
          "https://api.blockcypher.com/v1/btc/test3/addrs/" +
          sender +
          "?token=" +
          config.BC_TOKEN +
          "&unspentOnly=true",
        method: "GET",
        json: true,
      };

      const data = await rp(utxoOptions);
      let balance = data.final_balance;
      let count = 0;

      if (data.txrefs) {
        data.txrefs.forEach((obj) => {
          const txId = obj.tx_hash;
          const index = obj.tx_output_n;
          count += 1;
          txb.addInput(txId, index);
        });
      }

      if (data.unconfirmed_txrefs) {
        data.unconfirmed_txrefs.forEach((obj) => {
          const txId = obj.tx_hash;
          const index = obj.tx_output_n;
          count += 1;
          txb.addInput(txId, index);
        });
      }

      const fee = 148 * count + 34 * 2 + 10 * perSatoshi;
      const change = balance - (amount + fee);

      txb.addOutput(recipient, amount);
      txb.addOutput(sender, change);

      for (let i = 0; i < count; i++) {
        txb.sign(i, senderKeyPair);
      }

      const tx = txb.build();
      const txhex = tx.toHex();

      const pushOptions = {
        method: "POST",
        uri:
          "https://api.blockcypher.com/v1/btc/test3/txs/push" +
          "?token=" +
          config.BC_TOKEN,
        body: {
          tx: txhex,
        },
        json: true,
      };
      const result = await rp(pushOptions);
      res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(422).send({
        errors: [{ title: "Transaction error", detail: "送金に失敗しました" }],
      });
    }
  }
});

module.exports = router;
