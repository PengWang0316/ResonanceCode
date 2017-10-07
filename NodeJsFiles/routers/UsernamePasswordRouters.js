const usernamePasswordRouters = require("express").Router(),
      mongodb = require("../MongoDB"),
      // API_BASE_URL = "/resonancecode/api/v1/",
      jwt = require("jsonwebtoken"),
      axios = require("axios"),
      bcrypt = require("bcrypt");

usernamePasswordRouters.get("/usernamePasswordLogin", (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if(result.length === 0) res.json({user: {isAuth: false, loginErr: true}});
    else {
      bcrypt.compare(req.query.password, result[0].password).then(compareResult => {
        if(compareResult) {
          res.json(signJWT(result[0]));
        } else res.json({user: {isAuth: false, loginErr: true}});
      }).catch(err => console.log(err));
    }
  });
});

usernamePasswordRouters.get("/checkUsernameAvailable", (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if(result.length === 0) res.json({isAuth: false, isUsernameAvailable: true, isChecked: true});
    else res.json({isAuth: false, isUsernameAvailable: false, isChecked: true});
  }).catch(err => console.log(err));
});

usernamePasswordRouters.post("/registerNewUser", (req, res) => {
  bcrypt.hash(req.body.password, process.env.SALT_ROUNDS * 1).then( hash => {
    mongodb.registerNewUser({username: req.body.username, password: hash, role: 3, createDate: new Date(), displayName: req.body.username}).then(result => {
      console.log("result: ", result);
      res.json(signJWT(result));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));

});

/* This function return a non-password user object with a jwt property */
function signJWT (result) {
  // console.log("result:", result);
  const user = Object.assign({isAuth: true}, result);
  delete user.password;
  return {user, jwt: jwt.sign(user, process.env.JWT_SECERT)};
  // console.log("backResult", backResult);
  // return backResult;
}

module.exports = usernamePasswordRouters;
