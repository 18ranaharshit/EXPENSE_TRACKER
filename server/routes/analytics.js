const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

router.get('/summary', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Expense.find({ user: req.user._id });
    const monthly = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= start && d < end;
    });

    const income = monthly.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const expense = monthly.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

    const totalIncome = expenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpense = expenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

    res.json({
      totalBalance: totalIncome - totalExpense,
      monthlyIncome: income,
      monthlyExpense: expense,
      savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthly', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear().toString();
    const expenses = await Expense.find({ 
      user: req.user._id,
      date: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    });

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const result = months.map((label, i) => {
      const monthIdx = i;
      const monthly = expenses.filter(e => new Date(e.date).getMonth() === monthIdx);
      return {
        month: label,
        income: monthly.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0),
        expense: monthly.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const monthly = await Expense.find({ 
      user: req.user._id, 
      type: 'expense',
      date: { $gte: start, $lt: end }
    });

    const totals = {};
    monthly.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    const total = Object.values(totals).reduce((s, v) => s + v, 0);
    const result = Object.entries(totals).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      count: monthly.filter(e => e.category === category).length
    })).sort((a, b) => b.amount - a.amount);

    res.json({ categories: result, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/heatmap', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const monthly = await Expense.find({ 
      user: req.user._id, 
      type: 'expense',
      date: { $gte: start, $lt: end }
    });

    const heatmap = {};
    monthly.forEach(e => {
      const dateStr = new Date(e.date).toISOString().split('T')[0];
      heatmap[dateStr] = (heatmap[dateStr] || 0) + e.amount;
    });

    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
