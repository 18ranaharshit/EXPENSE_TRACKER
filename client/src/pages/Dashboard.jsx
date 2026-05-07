import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, ShieldCheck, Plus } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import LineChart from '../components/charts/LineChart';
import DonutChart from '../components/charts/DonutChart';
import TransactionRow from '../components/TransactionRow';
import AddExpenseModal from '../components/AddExpenseModal';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatCurrency';

const API = 'http://localhost:3001/api';

export default function Dashboard() {
  const { transactions, deleteTransaction } = useExpense();
  const [summary, setSummary] = useState({ totalBalance: 0, monthlyIncome: 0, monthlyExpense: 0, savingsRate: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [catData, setCatData] = useState({ categories: [], total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    fetch(`${API}/analytics/summary?month=${month}`).then(r => r.json()).then(setSummary).catch(() => {});
    fetch(`${API}/analytics/monthly`).then(r => r.json()).then(setMonthlyData).catch(() => {});
    fetch(`${API}/analytics/categories?month=${month}`).then(r => r.json()).then(setCatData).catch(() => {});
  }, [transactions]);

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const openAdd = () => { setEditTx(null); setShowModal(true); };
  const openEdit = (tx) => { setEditTx(tx); setShowModal(true); };

  return (
    <div className="page-content">
      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard label="Total Balance" value={summary.totalBalance} icon={Wallet} accentColor="#7C3AED" subtext="Updated just now" />
        <SummaryCard label="Monthly Income" value={summary.monthlyIncome} icon={TrendingUp} accentColor="#10B981" subtext={`Savings rate ${summary.savingsRate}%`} subtextColor="var(--success)" />
        <SummaryCard label="Monthly Expenses" value={summary.monthlyExpense} icon={TrendingDown} accentColor="#EF4444" subtext="This month" />
        <SummaryCard label="Savings Rate" value={summary.savingsRate} icon={ShieldCheck} accentColor="#F59E0B" isCurrency={false} isPercent subtext="Target: 40%" />
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Income vs Expenses — Last 6 Months</h3>
          <LineChart data={monthlyData.slice(0, 6)} />
        </div>
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 4 }}>Spending by Category</h3>
          <DonutChart data={catData.categories} total={catData.total} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <h3 className="section-title">Recent Transactions</h3>
            <a href="/transactions" className="link">View All</a>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {recent.map(tx => <TransactionRow key={tx.id} tx={tx} onEdit={openEdit} onDelete={deleteTransaction} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={openAdd} aria-label="Add transaction">
        <Plus size={24} />
        <span className="fab-label">Add Expense</span>
      </button>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} editTx={editTx} />}
    </div>
  );
}
