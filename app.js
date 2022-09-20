// BASE SETUP
// =============================================================================
const express = require('express');
var app = express();
const http = require('http');
require('dotenv').config();
app.use(express.json());
var cors = require('cors');

let whitelist = ['http://localhost:4200'];
let corsOptions = {
  origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
      } else {
          callback(null, true)
          // callback(new Error('Not allowed by CORS'))
      }
  },
  credentials: true,
  preflightContinue: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'x-access-token',
      'Content-Range', 'Access-Control-Allow-Methods', '*'],
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
};
app.use(cors(corsOptions));

//  CONFIG
const config = require('./config/default.json');
const allRoutes = require('./routes');

const hostname = '127.0.0.1';
const port = 3000;
app.use(config.app.prefix, allRoutes);

//  START THE SERVER
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app // for testing