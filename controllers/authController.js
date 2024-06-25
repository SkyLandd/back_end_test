const response = require('../utils/response');

const authHelper = require('./../helpers/authHelper');

module.exports.register = async (req, res) => {
  try {

    const data = await authHelper.register(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.login = async (req, res) => {
  try {

    const data = await authHelper.login(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {

    const data = await authHelper.verifyEmail(req)
    response.successResponse(res, data);
    
  } catch (error) {
    res.status(400).send(error.message);
  }
};
