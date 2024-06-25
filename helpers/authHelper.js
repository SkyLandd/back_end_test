const jwt = require('jsonwebtoken');

const config = require('../config/config');

const User = require('../models/User');

const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');

exports.register = async (req) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    const token = generateToken(user);
    const url = await sendVerificationEmail(user, token);
    return { user, url }
  } catch (error) {
    throw error;
  }
};

exports.login = async (req) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    if (!user.isVerified) {
      throw new Error('Please verify your email');
    }
    const token = generateToken(user);
    return { user, token }
  } catch (error) {
    throw error;
  }
};

exports.verifyEmail = async (req) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isVerified = true;
    await user.save();
    return { user }

  } catch (error) {
    console.log(error)
    throw error;
  }
};
