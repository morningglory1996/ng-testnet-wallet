"use strict";

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const config = require("../config/index");

router.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    return res.status(422).send({
      errors: [{ title: "User error", detail: "Eメールを入力してください" }],
    });
  }
  if (!password) {
    return res.status(422).send({
      errors: [{ title: "User error", detail: "パスワードを入力してください" }],
    });
  }
  User.findOne({ email }, function (err, foundUser) {
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

    if (!foundUser.hasSamePassword(password)) {
      return res.status(422).send({
        errors: [
          { title: "User error", detail: "パスワードが正しくありません" },
        ],
      });
    }

    const token = jwt.sign(
      {
        userId: foundUser.id,
        userName: foundUser.userName,
        address: foundUser.address,
      },
      config.SECRET,
      { expiresIn: "1h" }
    );

    return res.json(token);
  });
});

router.post("/register", function (req, res) {
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const address = "address";
  const privateKey = "privateKey";

  if (!userName) {
    return res.status(422).send({
      errors: [{ title: "User error", detail: "ユーザー名を入力してください" }],
    });
  }
  if (!email) {
    return res.status(422).send({
      errors: [{ title: "User error", detail: "Eメールを入力してください" }],
    });
  }
  if (!password) {
    return res.status(422).send({
      errors: [{ title: "User error", detail: "パスワードを入力してください" }],
    });
  }
  if (password !== confirmPassword) {
    return res.status(422).send({
      errors: [{ title: "User error", detail: "パスワードを確認してください" }],
    });
  }

  User.findOne({ email }, function (err, foundUser) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "User error", detail: "問題が発生しました" }],
      });
    }

    if (foundUser) {
      return res.status(422).send({
        errors: [
          {
            title: "User error",
            detail: "お使いのEメールはすでに使われてます",
          },
        ],
      });
    }

    const user = new User({
      userName,
      email,
      password,
      address,
      privateKey,
    });

    user.save(function (err, newUser) {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "User error", detail: "問題が発生しました" }],
        });
      }
      return res.json({ registered: true, newUser: newUser });
    });
  });
});

module.exports = router;
