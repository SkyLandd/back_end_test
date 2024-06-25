const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

module.exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};
