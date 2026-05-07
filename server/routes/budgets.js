const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../middleware/validate');
const { v4: uuidv4 } = require('uuid');

const FILE = 'budgets.json';

router.get('/', (req, res) => {
  try {
    const data = readData(FILE);
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const filtered = data.filter(b => b.month === month);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { category, limit, month, carryForward } = req.body;
    if (!category || !limit) return res.status(400).json({ error: 'category and limit are required' });
    const data = readData(FILE);
    const newBudget = {
      id: uuidv4(),
      category,
      limit: parseFloat(limit),
      spent: 0,
      month: month || new Date().toISOString().slice(0, 7),
      carryForward: carryForward || false
    };
    data.push(newBudget);
    writeData(FILE, data);
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const data = readData(FILE);
    const idx = data.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data[idx] = { ...data[idx], ...req.body, id: req.params.id };
    if (data[idx].limit) data[idx].limit = parseFloat(data[idx].limit);
    writeData(FILE, data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const data = readData(FILE);
    const idx = data.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data.splice(idx, 1);
    writeData(FILE, data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
