const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// GET all budgets
router.get('/', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const budgets = await Budget.find({ user: req.user._id, month });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create budget
router.post('/', async (req, res) => {
  try {
    const { category, limit, month, carryForward } = req.body;
    if (!category || !limit) return res.status(400).json({ error: 'category and limit are required' });

    const newBudget = new Budget({
      user: req.user._id,
      category,
      limit: parseFloat(limit),
      spent: 0,
      month: month || new Date().toISOString().slice(0, 7),
      carryForward: carryForward || false
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body },
      { new: true }
    );
    
    if (!budget) return res.status(404).json({ error: 'Not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
