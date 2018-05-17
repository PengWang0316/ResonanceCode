const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  if (user.role !== ADMINISTRATOR_ROLE) throw new Error('No invalid operation.');
  else return mongodb.updateHexagram(req.body.hexagram)
    .then(_ => res.sendStatus(200).end()).catch(err => logger.error(err));
};
