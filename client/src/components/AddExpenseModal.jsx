import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

const CATEGORIES = [
  { name: 'Food', emoji: '🍽️' }, { name: 'Rent', emoji: '🏠' },
  { name: 'Transport', emoji: '🚗' }, { name: 'Entertainment', emoji: '🎬' },
  { name: 'Health', emoji: '💊' }, { name: 'Shopping', emoji: '🛍️' },
  { name: 'Utilities', emoji: '⚡' }, { name: 'Others', emoji: '📦' },
];
const ACCOUNTS = ['Cash', 'Savings Account', 'Credit Card', 'UPI'];
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const DEFAULT_FORM = { title: '', amount: '', type: 'expense', category: 'Food', account: 'UPI', date: new Date().toISOString().slice(0, 10), notes: '', recurring: false, frequency: 'Monthly' };

export default function AddExpenseModal({ onClose, editTx }) {
  const { addTransaction, updateTransaction } = useExpense();
  const [form, setForm] = useState(editTx ? { ...editTx, amount: String(editTx.amount), date: editTx.date } : DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTx) setForm({ ...editTx, amount: String(editTx.amount) });
  }, [editTx]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) e.amount = 'Please enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editTx) await updateTransaction(editTx.id, payload);
      else await addTransaction(payload);
      onClose();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <div className="type-toggle" style={{ marginTop: 12 }}>
              <button type="button" className={form.type === 'expense' ? 'active-expense' : ''} onClick={() => set('type', 'expense')}>Expense</button>
              <button type="button" className={form.type === 'income' ? 'active-income' : ''} onClick={() => set('type', 'income')}>Income</button>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Transaction Title</label>
              <input className={`form-input${errors.title ? ' error' : ''}`} placeholder="e.g. Swiggy Order" value={form.title} onChange={e => set('title', e.target.value)} />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount</label>
              <div className="input-prefix">
                <span className="input-prefix-text">₹</span>
                <input className={`form-input mono${errors.amount ? ' error' : ''}`} placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} type="number" min="0" step="0.01" />
              </div>
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="category-grid">
                {CATEGORIES.map(c => (
                  <button type="button" key={c.name} className={`category-btn${form.category === c.name ? ' selected' : ''}`} onClick={() => set('category', c.name)}>
                    <span className="cat-emoji">{c.emoji}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Account */}
            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className={`form-input${errors.date ? ' error' : ''}`} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Account</label>
                <select className="form-input" value={form.account} onChange={e => set('account', e.target.value)}>
                  {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea className="form-input" rows={3} placeholder="Add a note or description" value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} maxLength={200} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{form.notes.length}/200</span>
            </div>

            {/* Recurring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="toggle">
                <input type="checkbox" checked={form.recurring} onChange={e => set('recurring', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Mark as Recurring</span>
            </div>
            {form.recurring && (
              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select className="form-input" value={form.frequency} onChange={e => set('frequency', e.target.value)}>
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>{saving ? 'Saving...' : 'Save Transaction'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
