const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto-js');
const config = require('../config/index');

const network = bitcoin.networks.testnet;

const Schema = mongoose.Schema;
 
const User = new Schema({
  userName: { type: String,
    required: true,
    max:(15, 'ユーザー名は最大15文字まで')
  },
  email: { type: String,
    required: true,
    unique: true,
    lowercase: true,
    max:(60, 'Eメールは最大60文字まで')
  },
  password: {
    type: String,
    required: true,
    min:(6, 'パスワードは6文字以上で入力して下さい'),
    max:(30, 'パスワードは最大30文字まで')
  },
  address: {
    type: String,
    required: ture
  },
  privateKey: {
    type: String,
    required: ture
  }
});

User.methods.hasSamePassword = function(inputPassword) {
  const user = this;
  return bcrypt.compareSync(inputPassword, user.password);
}

User.pre('save', function(next) {
  const user = this;
  const saltRounds = 10;

  const keyPair = bitcoin.ECPair.makeRandom({ network: network });
  const pkwif = keyPair.toWIF();
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network
  });

  const encryptedPk = crypto.AES.encrypt(pkwif, config.KEY).toString();

  user.address = address;
  user.privateKey = encryptedPk;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', User);