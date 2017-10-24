const googleAuthRouter = require('express')();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require('jsonwebtoken');

const mongodb = require('../MongoDB');

googleAuthRouter.use(passport.initialize());
// googleAuthRouter.use(passport.session());

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}/api/v1/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      googleId: profile.id,
      facebookId: '',
      displayName: profile.displayName,
      photo: profile.photos[0] ? profile.photos[0].value : '',
      email: profile.emails[0] ? profile.emails[0].value : ''
    };
    return done(null, user);
  /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       }); */
  }
));

passport.serializeUser((user, done) => {
  console.log('serializeUser: ', user);
  done(null, user);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  done(null, null);
});

googleAuthRouter.get(
  '/googleLogin',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
  })
);

googleAuthRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT }),
  (req, res) => {
    // Fetch or create a user from database.
    mongodb.fetchOrCreateUser(req.user).then(result => {
      console.log('result: ', result);
      // Successful authentication, redirect home.
      const jwtMessage = jwt.sign(
        Object.assign({ isAuth: true, role: result.value.role || 3 }, result.value),
        process.env.JWT_SECERT
      );
      // console.log(result.value);
      // console.log(jwtMessage);
      res.redirect(`${process.env.REACT_LOGIN_CALLBACK_RUL}?jwt=${jwtMessage}`);
    }).catch(err => console.log(err));
  }
);

module.exports = googleAuthRouter;
