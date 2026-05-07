import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import BudgetCard from '../components/BudgetCard';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatCurrency';

const CATEGORIES = ['Food','Rent','Transport','Entertainment','Health','Shopping','Utilities','Others'];

function AddBudgetModal({ onClose, onSave, existing }) {
  const [form, setForm] = useState({ category: 'Food', limit: '', carryForward: false });
  const [err, setErr] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.limit || parseFloat(form.limit) <= 0) { setErr('Enter a valid limit'); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add Category Budget</h2>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.filter(c => !existing.includes(c)).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Limit</label>
            <div className="input-prefix">
              <span className="input-prefix-text">₹</span>
              <input className="form-input mono" type="number" min="1" placeholder="0.00" value={form.limit} onChange={e => set('limit', e.target.value)} />
            </div>
            {err && <span className="form-error">{err}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label className="toggle">
              <input type="checkbox" checked={form.carryForward} onChange={e => set('carryForward', e.target.checked)} />
              <span className="toggle-slider" />
            </label>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Carry Forward Unused Budget</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unused budget rolls over to next month</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline btn-full" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-full" onClick={handleSave}>Save Budget</button>
        </div>
      </div>
    </div>
  );
}

export default function Budget() {
  const { budgets, addBudget, updateBudget, deleteBudget, transactions } = useExpense();
  const [showModal, setShowModal] = useState(false);
  const month = new Date().toISOString().slice(0, 7);

  // Enrich budgets with transaction counts
  const enriched = budgets.map(b => {
    const txCount = transactions.filter(t => t.category === b.category && t.date.startsWith(month) && t.type === 'expense').length;
    return { ...b, txCount };
  });

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const existingCats = budgets.map(b => b.category);

  const handleAdd = async (form) => {
    await addBudget({ ...form, limit: parseFloat(form.limit), month });
    setShowModal(false);
  };

  return (
    <div className="page-content">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { label: 'Total Budget', value: totalBudget, color: 'var(--accent)' },
          { label: 'Total Spent', value: totalSpent, color: 'var(--expense)' },
          { label: 'Remaining', value: totalRemaining, color: 'var(--income)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, color }}>{formatCurrency(value)}</div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="card card-body" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Overall Budget Usage</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: overallPct >= 80 ? 'var(--warning)' : 'var(--success)' }}>{overallPct}%</span>
        </div>
        <div className="progress-bar-wrap" style={{ height: 10 }}>
          <div className="progress-bar-fill" style={{ width: `${overallPct}%`, background: overallPct >= 80 ? 'var(--warning)' : overallPct >= 100 ? 'var(--danger)' : 'var(--success)' }} />
        </div>
      </div>

      {/* Budget cards grid */}
      <div className="budget-grid">
        {enriched.map(b => (
          <BudgetCard key={b.id} budget={b} onEdit={() => {}} onDelete={deleteBudget} />
        ))}
        <div className="card budget-add-card" onClick={() => setShowModal(true)}>
          <Plus size={28} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Add Category Budget</span>
        </div>
      </div>

      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} onSave={handleAdd} existing={existingCats} />}
    </div>
  );
}
