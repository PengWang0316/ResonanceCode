const facebookAuthRouters = require('express')();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const jwt = require('jsonwebtoken');
const mongodb = require('../MongoDB');
const winston = require('winston');

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


/* Setting up Facebook authentication strategy */
facebookAuthRouters.use(passport.initialize());
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.FACEBOOK_CALLBACK_URL}/api/v1/auth/facebook/callback`,
  // callbackURL: "http://localhost:8080/"
  },
  ((accessToken, refreshToken, profile, cb) => {
  // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  // console.log("facebook strategy callback:", accessToken, refreshToken, profile);
    const user = {
      facebookId: profile.id,
      googleId: '',
      displayName: profile.displayName,
      photo: `https://graph.facebook.com/${profile.id}/picture?height=20&width=20`
    };
    return cb(null, user);
  })
));

passport.serializeUser((user, done) => {
  // console.log('serializeUser: ', user);
  done(null, user.facebookId);
});

passport.deserializeUser((id, done) => {
  // console.log('deserializeUser');
  done(null, null);
});

facebookAuthRouters.get(
  '/facebookLogin',
  passport.authenticate('facebook')
);

facebookAuthRouters.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: process.env.FACEBOOK_FAILURE_REDIRECT }),
  (req, res) => {
    // Fetch or create a user from database.
    mongodb.fetchOrCreateUser(req.user).then(result => {
      // Successful authentication, redirect home.
      const jwtMessage = jwt.sign(
        Object.assign({ isAuth: true, role: result.value.role || 3 }, result.value),
        process.env.JWT_SECERT
      );
      // console.log(result.value);
      // console.log(process.env.REACT_LOGIN_CALLBACK_RUL);
      res.redirect(`${process.env.REACT_LOGIN_CALLBACK_RUL}?jwt=${jwtMessage}`);
    }).catch(err => logger.error('facebookAuthRouters => /facebook/callback', err));
  }
);

module.exports = facebookAuthRouters;
