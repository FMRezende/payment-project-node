const express = require('express');
const { json, urlencoded } = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('express-jwt');
const dotenv = require("dotenv");
const config = require('./config.js');
const walletRouter = require('./resources/wallet/wallet.router.js');
const mongo = require("./config/mongo");
const newsletterRouter = require('./resources/newsletter/newsletter.router');


var path = require('path');
global.appRoot = path.resolve(__dirname);

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.disable('x-powered-by');
app.use('/api/wallet', walletRouter);
app.use('/api/newsletter', newsletterRouter);

const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  start,
  app,
};