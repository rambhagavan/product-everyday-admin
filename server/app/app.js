// Package Imports
const express = require('express');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Local Pakage Imports
const logger = require('./core/logger')
const setupDB = require('./utils/db');
const router = require('./routes');
const corsOptions = require('./middleware/cors');

// Code
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(session({
  secret: '#4%^^&G$$$$#@@@@ggy**',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: (1000 * 60 * 100)
  }
}))

setupDB()

require('./core/passport')

app.use(passport.initialize());
app.use(passport.session(session));

if (process.env.NODE_ENV === 'production') {
  logger.info("Production Env")
} else {
  logger.info("Dev Env")
}
app.use((req, res, next) => {
  logger.info(req.protocol + '://' + req.get('host') + req.originalUrl)
  next()
})

app.use(router)
app.get('/', (req, res) => {
  res.send('Welcome User!  ')
})

module.exports = app
