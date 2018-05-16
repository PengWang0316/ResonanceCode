const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');


module.exports = (req, res) =>
  mongodb.fetchOneUser(verifyJWT({ message: req.query.jwtMessage, res })._id)
    .then(result => res.json({ ...result, isAuth: true }))
    .catch(err => logger.error('/jwtMessageVerify', err));
