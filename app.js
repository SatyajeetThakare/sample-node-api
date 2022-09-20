// BASE SETUP
// =============================================================================
const express = require('express');
var app = express();
const http = require('http');
require('dotenv').config();
app.use(express.json());

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