const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// GET all expenses (with optional filters) — uses .lean() + projections
router.get('/', async (req, res) => {
  try {
    const { type, category, month, search, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.date = { $gte: start, $lt: end };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Parallel count + fetch for speed
    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .select('title amount type category account date notes recurring frequency')
        .sort({ date: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Expense.countDocuments(query)
    ]);

    res.json({ 
      data: expenses, 
      total, 
      page: pageNum, 
      limit: limitNum, 
      pages: Math.ceil(total / limitNum) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single expense — .lean() for speed
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, account, date, notes, recurring, frequency } = req.body;
    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({ error: 'title, amount, type, category, date are required' });
    }

    const newExpense = new Expense({
      user: req.user._id,
      title,
      amount: parseFloat(amount),
      type,
      category,
      account: account || 'Cash',
      date,
      notes: notes || '',
      recurring: recurring || false,
      frequency: frequency || null
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body },
      { new: true }
    ).lean();
    
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
