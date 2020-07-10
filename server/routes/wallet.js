'use strict'

const express = require('express');
const router = express.Router();
const bitcoin = require('bitcoinjs-lib');
const rp  = require('request-promise-native');
const crypto = require('crypto-js');
const moment = require('moment-timezone');
const User = require('../model/user');
const UserCtrl = require('../controllers/user');

const networkName = 'testnet';
const network = bitcoin.networks[networkName];

const config = require('../config/index');

function filterBytxHash (array) {
  const itemTxIds = array.map((item) => {
      return item.txId;
  });
  return array.filter((item, index) => {
      return itemTxIds.indexOf(item.txId) === index;
  });
};

router.get('/:userId',  UserCtrl.authMiddleware, async function(req, res) {
  const userId = req.params.userId;

  const foundUser = await User.findById(userId, function(err, foundUser) {
    if(err) {
      return res.status(422).send({ errors: [{ title: 'User error', detail: '問題が発生しました' }]});
    }

    if(!foundUser) {
      return res.status(422).send({ errors: [{ title: 'User error', detail: 'ユーザーが見つかりません' }]});
    }

    return foundUser;
  });

  if(foundUser) {
    try {
      const address = foundUser.address;
      const options = {
        url: 'https://api.blockcypher.com/v1/btc/test3/addrs/' + address,
        method: 'GET',
        json: true
      };

      const data = await rp(options);
      const balance = data.final_balance;
      let unconfirmedTxs = [];
      let txs = [];

      if(data.unconfirmed_txrefs) {
        for(let i = 0; i < data.unconfirmed_txrefs.length; i++) {
          const txId = data.unconfirmed_txrefs[i].tx_hash;
          const timeStamp = moment(data.unconfirmed_txrefs[i].received).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
          const obj = { txId, timeStamp };
          unconfirmedTxs.push(obj);
        }
      }
      if(data.txrefs) {
        for(let i = 0; i < data.txrefs.length; i++) {
          const txId = data.txrefs[i].tx_hash;
          const blockHeight = data.txrefs[i].block_height;
          const value = data.txrefs[i].value;
          const timeStamp = moment(data.txrefs[i].confirmed).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
          let confirmations = data.txrefs[i].confirmations;
          if (confirmations > 6) {
            confirmations = '6+';
          }
          const obj = { txId, timeStamp, confirmations, blockHeight, value };
          txs.push(obj);
        }
      }

      const filterUnTxs = filterBytxHash(unconfirmedTxs);
      const filterTxs = filterBytxHash(txs);
      const totalReceived = data.total_received;
      const totalSent = data.total_sent;
      const numberTx = data.final_n_tx;
      const numberUnTx = data.unconfirmed_n_tx;

      const getPrice = {
        url: `https://blockchain.info/ticker`,
        method: 'GET',
        json: true
      }

      const price = await rp(getPrice);
      const currentJPY = price.JPY.last;

      return res.json({address, balance, filterUnTxs, filterTxs, totalReceived, totalSent, numberTx, numberUnTx, currentJPY});

    } catch(err) {
      return res.status(422).send({ errors: [{ title: 'Request error', detail: '問題が発生しました' }]});
    }
  }
});


router.post('/:userId', UserCtrl.authMiddleware, async function(req, res) {
  const recipient = req.body.recipient;
  const amount = parseInt(req.body.amount, 10);
  const fee = parseInt(req.body.fee, 10);
  const userId = req.params.userId;

  if(!recipient) {
    return res.status(422).send({ errors: [{ title: 'Transaction error', detail: '宛先を入力してください' }]});
  }

  if(!amount) {
    return res.status(422).send({ errors: [{ title: 'Transaction error', detail: '送金金額を入力してください' }]});
  }

  const foundUser = await User.findById(userId, function(err, foundUser) {
    if(err) {
      return res.status(422).send({ errors: [{ title: 'User error', detail: '問題が発生しました' }]});
    }

    if(!foundUser) {
      return res.status(422).send({ errors: [{ title: 'User error', detail: 'ユーザーが見つかりません' }]});
    }

    return foundUser;
  });

  if(foundUser) {
    try {
      const sender = foundUser.address;
      const privateKey = foundUser.privateKey;

      const decryptedPk = crypto.AES.decrypt(privateKey, config.KEY).toString(crypto.enc.Utf8);
      // generate keypair
      const senderKeyPair = bitcoin.ECPair.fromWIF(decryptedPk, network);
      // create transactionBuilder
      const txb = new bitcoin.TransactionBuilder(network);
      txb.setVersion(1);

      const utxoOptions = {
        url: 'https://api.blockcypher.com/v1/btc/test3/addrs/' + sender + '?unspentOnly=true',
        method: 'GET',
        json: true
      };

      const data = await rp(utxoOptions);
      let balance = data.final_balance;
      let count = 0;

      if(data.txrefs) {
        data.txrefs.forEach((obj) => {
          const txId = obj.tx_hash;
          const index = obj.tx_output_n;
          count += 1;
          txb.addInput(txId, index);
          });
      }

      if(data.unconfirmed_txrefs) {
        data.unconfirmed_txrefs.forEach((obj) => {
          const txId = obj.tx_hash;
          const index = obj.tx_output_n;
          count += 1;
          txb.addInput(txId, index);
        });
      }

      const change = balance - (amount + fee);

      txb.addOutput(recipient, amount);
      txb.addOutput(sender, change);

      for(let i = 0; i < count; i++) {
        txb.sign(i, senderKeyPair);
      }

      const tx = txb.build();
      const txhex = tx.toHex();
      
      const pushOptions = {
        method: 'POST',
        uri: 'https://api.blockcypher.com/v1/btc/test3/txs/push',
        body: {
            tx: txhex
        },
        json: true
      };
      const result = await rp(pushOptions);
      res.json(result);
    } catch(err) {
      console.log(err);
      return res.status(422).send({ errors: [{ title: 'Transaction error', detail: '送金に失敗しました' }]});
    }
  }
});


module.exports = router;