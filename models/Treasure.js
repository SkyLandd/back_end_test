const mongoose = require('mongoose');

const treasureSchema = new mongoose.Schema({
  type: { type: String, required: true, min: 3 },
  point: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Treasure', treasureSchema);
