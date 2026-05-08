const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  account: { type: String, default: 'Cash' },
  date: { type: Date, required: true },
  notes: String,
  recurring: { type: Boolean, default: false },
  frequency: String
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
