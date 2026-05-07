const express = require('express');
const cors = require('cors');

const expensesRouter = require('./routes/expenses');
const budgetsRouter = require('./routes/budgets');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expensesRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`ExpenseIQ server running at http://localhost:${PORT}`);
});
