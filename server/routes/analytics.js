const express = require('express');
const router = express.Router();
const { readData } = require('../middleware/validate');

router.get('/summary', (req, res) => {
  try {
    const expenses = readData('expenses.json');
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const monthly = expenses.filter(e => e.date.startsWith(month));

    const income = monthly.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const expense = monthly.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

    // Total balance = all income - all expenses ever
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

router.get('/monthly', (req, res) => {
  try {
    const expenses = readData('expenses.json');
    const year = req.query.year || new Date().getFullYear().toString();

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const result = months.map((label, i) => {
      const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
      const monthly = expenses.filter(e => e.date.startsWith(monthKey));
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

router.get('/categories', (req, res) => {
  try {
    const expenses = readData('expenses.json');
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const monthly = expenses.filter(e => e.date.startsWith(month) && e.type === 'expense');

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

router.get('/heatmap', (req, res) => {
  try {
    const expenses = readData('expenses.json');
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const monthly = expenses.filter(e => e.date.startsWith(month) && e.type === 'expense');

    const heatmap = {};
    monthly.forEach(e => {
      heatmap[e.date] = (heatmap[e.date] || 0) + e.amount;
    });

    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
