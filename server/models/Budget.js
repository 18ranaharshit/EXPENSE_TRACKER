const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  period: { type: String, default: 'monthly' }
}, { timestamps: true });

// Compound index for user budget lookups
budgetSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
