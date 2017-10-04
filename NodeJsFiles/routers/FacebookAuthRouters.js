const facebookAuthRouters = require("express")(),
      passport = require("passport"),
      FacebookStrategy = require("passport-facebook"),
      jwt = require("jsonwebtoken");


/*Setting up Facebook authentication strategy*/
facebookAuthRouters.use(passport.initialize());
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL + "/auth/facebook/callback",
    //callbackURL: "http://localhost:8080/"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  // console.log("facebook strategy callback:", accessToken, refreshToken, profile);
    const user = { id: profile.id, displayName: profile.displayName, isAuth: true};
    return cb(null, user);
  }
));

passport.serializeUser((user, done) => {
  console.log("serializeUser: ", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializeUser");
  done(null, null);
});

facebookAuthRouters.get('/facebook',
  passport.authenticate('facebook'));

facebookAuthRouters.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/');
    const facebookJwt = jwt.sign(req.user, process.env.JWT_SECERT);
    res.redirect(`${process.env.REACT_FACEBOOK_LOGIN_CALLBACK_RUL}?jwt=${facebookJwt}`);
  });

module.exports = facebookAuthRouters;
