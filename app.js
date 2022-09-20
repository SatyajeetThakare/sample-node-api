// BASE SETUP
// =============================================================================
const express = require('express')
var app = express()
// var cors = require('cors')
// const bodyParser = require('body-parser')
// const session = require('express-session')

// const uuid = require('uuid').v4;
// const MongoStore = require('connect-mongo');
// const cookieParser = require('cookie-parser');
// const ErrorHandler = require('./utility/ErrorHandler').handleError;

const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
    throw result.error;
}

const allRoutes = require('./routes');

//  CONFIG
const config = require('./config/default.json');

//  ROUTES
// let corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(null, true)
//             // callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true,
//     preflightContinue: false,
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'x-access-token',
//         'Content-Range', 'Access-Control-Allow-Methods', '*'],
//     methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
// }
// app.use(cors(corsOptions))

app.use((req, res, next) => {
    next();
});

//  DEFINE OUR APP USING EXPRESS

let whitelist = ['http://localhost:4200']

// app.use(bodyParser.urlencoded({
//     extended: true,
//     limit: '2mb',
// }))
// app.use(bodyParser.json({ limit: '2mb' }))
// app.use(cookieParser())

// const sess = {
//     key: config.cookie.name,
//     secret: config.app.secret,
//     cookie: {
//         domain: config.cookie.domain,
//         path: config.cookie.path,
//         maxAge: config.cookie.validity * 1000,
//         httpOnly: false,
//     },
//     resave: false,
//     saveUninitialized: false,
//     // store: store,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGO_URL ? process.env.MONGO_URL : config.db.mongodb_session_store_url + config.db.session_db_name + config.db.session_db_options,
//         ttl: config.cookie.validity,
//         autoRemove: 'native', // Default
//     }),
//     name: config.cookie.name,
//     genid: function () {
//         return uuid() // use UUIDs for session IDs
//     },
// }

// app.use(session(sess))
//  HELMET
//  Helmet helps you secure your Express apps by setting various HTTP headers
//  let helmetOpts = {
//    frameguard: false,
//  }
//  app.use(helmet(helmetOpts))

// Use Mongo Store for Session data storage

// app.get('/', (req, res) => {
//     res.status(200).json({
//         msg: 'Welcome to Collaborate API Services',
//     });
// });
// app.use(allRoutes);

app.use(config.app.prefix, allRoutes)

// app.use(express.static('uploads'));

// app.use(ErrorHandler);

const hostname = '127.0.0.1';
const port = 3000;
//  START THE SERVER
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//  START THE SERVER
// app.listen((process.env.PORT || config.server.port), function() {
//     console.log("Server is listening at port:" + process.env.PORT || config.server.port);
// });
module.exports = app // for testing