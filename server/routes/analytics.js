const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Summary — uses MongoDB aggregation pipeline instead of loading ALL documents into JS
router.get('/summary', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Parallel: monthly aggregation + total aggregation
    const [monthlyAgg, totalAgg] = await Promise.all([
      Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
        { $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }}
      ]),
      Expense.aggregate([
        { $match: { user: req.user._id } },
        { $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }}
      ])
    ]);

    const monthly = { income: 0, expense: 0 };
    monthlyAgg.forEach(r => { monthly[r._id] = r.total; });

    const totals = { income: 0, expense: 0 };
    totalAgg.forEach(r => { totals[r._id] = r.total; });

    res.json({
      totalBalance: totals.income - totals.expense,
      monthlyIncome: monthly.income,
      monthlyExpense: monthly.expense,
      savingsRate: monthly.income > 0 ? Math.round(((monthly.income - monthly.expense) / monthly.income) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly breakdown — aggregation pipeline instead of loading full year into JS
router.get('/monthly', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const agg = await Expense.aggregate([
      { $match: {
        user: req.user._id,
        date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31T23:59:59`) }
      }},
      { $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' }
      }}
    ]);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const result = months.map((label, i) => {
      const monthNum = i + 1;
      const inc = agg.find(a => a._id.month === monthNum && a._id.type === 'income');
      const exp = agg.find(a => a._id.month === monthNum && a._id.type === 'expense');
      return {
        month: label,
        income: inc ? inc.total : 0,
        expense: exp ? exp.total : 0
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Category breakdown — aggregation pipeline
router.get('/categories', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const agg = await Expense.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: {
        _id: '$category',
        amount: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { amount: -1 } }
    ]);

    const total = agg.reduce((s, a) => s + a.amount, 0);
    const categories = agg.map(a => ({
      category: a._id,
      amount: a.amount,
      percentage: total > 0 ? Math.round((a.amount / total) * 100) : 0,
      count: a.count
    }));

    res.json({ categories, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Heatmap — aggregation pipeline
router.get('/heatmap', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const agg = await Expense.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        total: { $sum: '$amount' }
      }}
    ]);

    const heatmap = {};
    agg.forEach(a => { heatmap[a._id] = a.total; });

    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
