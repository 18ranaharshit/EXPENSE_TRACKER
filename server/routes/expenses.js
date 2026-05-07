const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../middleware/validate');
const { v4: uuidv4 } = require('uuid');

const FILE = 'expenses.json';

// GET all expenses (with optional filters)
router.get('/', (req, res) => {
  try {
    const data = readData(FILE);
    let expenses = [...data];

    if (req.query.type) expenses = expenses.filter(e => e.type === req.query.type);
    if (req.query.category) expenses = expenses.filter(e => e.category === req.query.category);
    if (req.query.month) expenses = expenses.filter(e => e.date.startsWith(req.query.month));
    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      expenses = expenses.filter(e => e.title.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q));
    }

    // Sort by date desc
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = expenses.length;
    const paginated = expenses.slice((page - 1) * limit, page * limit);

    res.json({ data: paginated, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single expense
router.get('/:id', (req, res) => {
  try {
    const data = readData(FILE);
    const expense = data.find(e => e.id === req.params.id);
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create expense
router.post('/', (req, res) => {
  try {
    const { title, amount, type, category, account, date, notes, recurring, frequency } = req.body;
    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({ error: 'title, amount, type, category, date are required' });
    }
    const data = readData(FILE);
    const newExpense = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      type,
      category,
      account: account || 'Cash',
      date,
      notes: notes || '',
      recurring: recurring || false,
      frequency: frequency || null
    };
    data.push(newExpense);
    writeData(FILE, data);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update expense
router.put('/:id', (req, res) => {
  try {
    const data = readData(FILE);
    const idx = data.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data[idx] = { ...data[idx], ...req.body, id: req.params.id };
    if (data[idx].amount) data[idx].amount = parseFloat(data[idx].amount);
    writeData(FILE, data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete('/:id', (req, res) => {
  try {
    const data = readData(FILE);
    const idx = data.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data.splice(idx, 1);
    writeData(FILE, data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
