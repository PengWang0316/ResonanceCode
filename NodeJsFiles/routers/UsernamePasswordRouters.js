const usernamePasswordRouters = require("express").Router(),
      mongodb = require("../MongoDB"),
      // API_BASE_URL = "/resonancecode/api/v1/",
      jwt = require("jsonwebtoken"),
      axios = require("axios"),
      bcrypt = require("bcrypt");

usernamePasswordRouters.get("/usernamePasswordLogin", (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if(result.length === 0) res.json({isAuth: false, loginErr: true});
    else {
      bcrypt.compare(req.query.password, result[0].password).then(compareResult => {
        if(compareResult) {
          res.json(signJWT(result[0]));
        } else res.json({isAuth: false, loginErr: true});
      }).catch(err => console.log(err));
    }
  });
});

usernamePasswordRouters.get("/checkUsernameAvailable", (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if(result.length === 0) res.json({isAuth: false, isUsernameAvailable: true, isChecked: true});
    else res.json({isAuth: false, isUsernameAvailable: false, isChecked: true});
  });
});

/* This function return a non-password user object with a jwt property */
function signJWT (result) {
  // console.log("result:", result);
  const backResult = Object.assign({isAuth: true}, result);
  delete backResult.password;
  backResult.jwt = jwt.sign(backResult, process.env.JWT_SECERT);
  // console.log("backResult", backResult);
  return backResult;
}

module.exports = usernamePasswordRouters;
