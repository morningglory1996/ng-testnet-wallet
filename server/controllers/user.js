'use strict'
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const User = require('../model/user');


exports.authMiddleware = function(req, res, next) {
  const token = req.headers.authorization;

  if(!token) {
    return res.status(401).send({ errors: [{ title: 'Auth error', detail: 'ログインしてください' }]});
  }

  jwt.verify(token.split(' ')[1], SECRET, function(err, decodedToken) {
    if(err) {
      return res.status(401).send({ errors: [{ title: 'Auth error', detail: 'トークンが無効です' }]});
    }

    User.findById(decodedToken.userId, function(err, foundUser) {
      if(err) {
        return res.status(401).send({ errors: [{ title: 'Auth error', detail: 'トークンが無効です' }]});
      }

      if(!foundUser) {
        return res.status(401).send({ errors: [{ title: 'Auth error', detail: 'ユーザーが見つかりません' }]});
      }
      next();
    });
  });
}