'use strict'

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/index');

const SampleUser = require('./sample-user');

const userRouter = require('./routes/user');
const path = require('path');

mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  if(process.env.NODE_ENV !== 'production') {
  console.log('MongoDB connection successful');
    const sampleUser = new SampleUser();
    // sampleUser.initDb();
  }
}).catch((error) => {
  console.log(error);
});


const app = express();
app.use(bodyParser.json());

app.use('/api/v1/user', userRouter);

if(process.env.NODE_ENV === 'production') {
  const appPath = path.join(__dirname, '..', 'dist', 'ng-testnet-wallet');
  app.use(express.static(appPath));
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 8000; 

app.listen(PORT, function(req, res) {
  console.log('Listeing on ' + PORT);
});