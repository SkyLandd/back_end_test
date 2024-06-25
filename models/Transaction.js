const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({

  treasureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treasure', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['Debit', 'Credit'] },
  value: { type: Number, required: true, min: 1 },

}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
