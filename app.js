// BASE SETUP
// =============================================================================
const express = require('express');
var app = express();
const http = require('http');
require('dotenv').config();
app.use(express.json());
// var session = require('express-session');

// const sess = {
//   key: config.cookie.name,
//   secret: config.app.secret,
//   cookie: {
//       domain: config.cookie.domain,
//       path: config.cookie.path,
//       maxAge: config.cookie.validity * 1000,
//       httpOnly: false,
//   },
//   resave: false,
//   saveUninitialized: false,
//   // store: store,
//   store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URL ? process.env.MONGO_URL : config.db.mongodb_session_store_url + config.db.session_db_name + config.db.session_db_options,
//       ttl: config.cookie.validity,
//       autoRemove: 'native', // Default
//   }),
//   name: config.cookie.name,
//   genid: function () {
//       return uuid() // use UUIDs for session IDs
//   },
// }
// app.use(session(sess))

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