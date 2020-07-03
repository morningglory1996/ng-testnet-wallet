const mongoose = require('mongoose');
const { strict } = require("assert");
const { mainModule } = require("process");

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
  address: String,
  privateKey: String
});

module.exports = mongoose.model('User', User);