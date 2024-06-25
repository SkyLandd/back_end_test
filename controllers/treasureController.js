const response = require('../utils/response');

const treasureHelper = require('./../helpers/treasureHelper');

module.exports.createTreasure = async (req, res) => {
  try {

    const data = await treasureHelper.createTreasure(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.collectTreasure = async (req, res) => {
  try {

    const data = await treasureHelper.collectTreasure(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.getStats = async (req, res) => {
  try {

    const data = await treasureHelper.getStats(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.getLeaderBoard = async (req, res) => {
  try {

    const data = await treasureHelper.getLeaderBoard(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.tradeTreasure = async (req, res) => {
  try {

    const data = await treasureHelper.tradeTreasure(req)
    response.successResponse(res, data);

  } catch (error) {
    res.status(400).send(error.message);
  }
};
