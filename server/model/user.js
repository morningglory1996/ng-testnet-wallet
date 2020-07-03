const mongoose = require('mongoose');
const { strict } = require("assert");
const { mainModule } = require("process");
const bcrypt = require('bcrypt');

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

User.methods.hasSamePassword = function(inputPassword) {
  const user = this;
  return bcrypt.compareSync(inputPassword, user.password);
}

User.pre('save', function(next) {
  const saltRounds = 10;
  const user = this;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', User);