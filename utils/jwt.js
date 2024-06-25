const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, config.jwtSecret, { expiresIn: '1d' });
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
