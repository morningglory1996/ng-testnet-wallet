'use strict'

const express = require('express');
const router = express.Router();
const bitcoin = require('bitcoinjs-lib');
const rp  = require('request-promise-native');
const crypto = require('crypto-js');
const User = require('../model/user');
const UserCtrl = require('../controllers/user');

const networkName = 'testnet';
const network = bitcoin.networks[networkName];

const config = require('../config/index');

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
      return res.json(data);

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