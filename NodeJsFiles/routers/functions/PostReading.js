const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const { jwtMessage, reading } = req.body;
  const user = verifyJWT({ message: jwtMessage, res });
  if (!user._id) {
    res.end('Invalid User.');
    return;
  }
  reading.user_id = user._id;
  // reading.userName = user.displayName;
  // const currentTime = new Date();
  reading.date = new Date(reading.date);

  // mongodb.createReading(reading).then(result => {
  //   mongodb.findHexagramImagesForReading(result).then(returnReading => res.json(returnReading));
  // }).catch(err => logger.error('/reading', err));
  return mongodb.createReading(reading).then(result => mongodb.findHexagramImagesForReading(result)).then(returnReading => res.json(returnReading)).catch(err => logger.error('/reading', err));
};
