const jwt = require('jsonwebtoken');
require('dotenv').config(); // Loading .env to process.env
/** Verify and return user object from jwt message
 * @param { object } object includes jwt message and response
 * @return { object } return the user object that was verified by jsonwebtoken
 */
const verifyJWT = ({ message, res }) => {
  try {
    res.status(200);
    return jwt.verify(message, process.env.JWT_SECERT);
  } catch (e) {
    res.status(200);
    res.json({ isAuth: false });
    return null;
  }
};
export default verifyJWT;
