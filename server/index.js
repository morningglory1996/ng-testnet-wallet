'use strict'

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/dev');

const SampleUser = require('./sample-user');

mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('MongoDB connection successful');
  const sampleUser = new SampleUser();
  sampleUser.pushUsertoDb();
}).catch((error) => {
  console.log(error);
});


const app = express();

app.get('/wallet', function(req, res) {
  res.json({ 'success': true });
});

const PORT = process.env.PORT || 8000; 

app.listen(PORT, function(req, res) {
  console.log('Listeing on ' + PORT);
});