const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.createTreasureSchema = Joi.object({
    type: Joi.string().min(3).max(30).required(),
    point: Joi.number().integer().min(1).required(),
});

exports.collectTreasureSchema = Joi.object({
    treasureId: Joi.objectId().required(),
    value: Joi.number().integer().min(1).required(),
});

exports.tradeTreasureSchema = Joi.object({
    userId2: Joi.objectId().required(),
    treasureId1: Joi.objectId().required(),
    treasureId2: Joi.objectId().required(),
    quantity: Joi.number().integer().min(1).required(),
});
