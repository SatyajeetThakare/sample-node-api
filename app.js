const express = require('express')
var app = express();
const http = require('http');

const config = require('./config/default.json')
const allRoutes = require('./routes');

const hostname = '127.0.0.1';
const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

app.use(config.app.prefix, allRoutes)

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app