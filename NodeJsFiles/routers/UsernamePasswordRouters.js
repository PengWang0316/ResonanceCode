const usernamePasswordRouters = require('express').Router();
// API_BASE_URL = "/resonancecode/api/v1/";
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');
const winston = require('winston');

const mongodb = require('../MongoDB');

require('dotenv').config(); // Loading .env to process.env

/** Setting up the Winston logger.
  * Under the development mode log to console.
*/
const logger = new winston.Logger({
  level: process.env.LOGGING_LEVEL,
  transports: [
    new (winston.transports.Console)()
  ]
});

/** Replaces the previous transports with those in the
new configuration wholesale.
  * When under the production mode, log to a file.
*/
if (process.env.NODE_ENV === 'production')
  logger.configure({
    level: 'error',
    transports: [
      new (winston.transports.File)({ filename: 'error.log' })
    ]
  });

/* This function return a non-password user object with a jwt property */
const signJWT = result => {
  // logger.err("result:", result);
  const user = Object.assign({ isAuth: true }, result);
  delete user.password;
  return { user, jwt: jwt.sign(user, process.env.JWT_SECERT) };
  // logger.err("backResult", backResult);
  // return backResult;
};

usernamePasswordRouters.get('/usernamePasswordLogin', (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if (result.length === 0) res.json({ user: { isAuth: false, loginErr: true } });
    else {
      bcrypt.compare(req.query.password, result[0].password).then(compareResult => {
        if (compareResult) {
          res.json(signJWT(result[0]));
        } else res.json({ user: { isAuth: false, loginErr: true } });
      }).catch(err => logger.err('/usernamePasswordLogin', err));
    }
  });
});

usernamePasswordRouters.get('/checkUsernameAvailable', (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if (result.length === 0) res.json({
      isAuth: false, isUsernameAvailable: true, isChecked: true
    });
    else res.json({ isAuth: false, isUsernameAvailable: false, isChecked: true });
  }).catch(err => logger.err('/checkUsernameAvailable', err));
});

usernamePasswordRouters.post('/registerNewUser', (req, res) => {
  bcrypt.hash(req.body.password, process.env.SALT_ROUNDS * 1).then(hash => {
    mongodb.registerNewUser({
      username: req.body.username, password: hash, role: 3, createDate: new Date(), displayName: req.body.username, facebookId: '', googleId: '', settings: { coinMode: true }
    }).then(result => {
      // logger.err("result: ", result);
      res.json(signJWT(result));
    }).catch(err => logger.err('/registerNewUser', err));
  }).catch(err => logger.err('/registerNewUser', err));
});

module.exports = usernamePasswordRouters;
