"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/index");

const SampleUser = require("./sample-user");

const userRouter = require("./routes/user");
const walletRouter = require("./routes/wallet");
const path = require("path");

mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.use(bodyParser.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/wallet", walletRouter);

if (process.env.NODE_ENV === "production") {
  const appPath = path.join(__dirname, "..", "dist", "ng-testnet-wallet");
  app.use(express.static(appPath));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(appPath, "index.html"));
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, function (req, res) {
  console.log("Listeing on " + PORT);
});
