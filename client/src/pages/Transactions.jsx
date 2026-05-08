import { useState, useMemo, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import TransactionRow from '../components/TransactionRow';
import AddExpenseModal from '../components/AddExpenseModal';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatCurrency';

const CATEGORIES = ['All','Food','Rent','Transport','Entertainment','Health','Shopping','Utilities','Others','Income'];

export default function Transactions() {
  const { transactions, deleteTransaction, fetchTransactions } = useExpense();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = !search || tx.title.toLowerCase().includes(search.toLowerCase()) || tx.notes?.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || tx.category === catFilter;
      const matchType = typeFilter === 'All' || tx.type === typeFilter.toLowerCase();
      return matchSearch && matchCat && matchType;
    });
  }, [transactions, search, catFilter, typeFilter]);

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openEdit = (tx) => { setEditTx(tx); setShowModal(true); };

  const exportCSV = () => {
    const rows = [['Date','Title','Category','Type','Amount','Account','Notes'], ...filtered.map(t => [t.date, t.title, t.category, t.type, t.amount, t.account, t.notes])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'transactions.csv'; a.click();
  };

  return (
    <div className="page-content">
      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search transactions..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="form-input" style={{ width: 'auto' }} value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="form-input" style={{ width: 'auto' }} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
          {['All','Income','Expense'].map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={exportCSV} style={{ marginLeft: 'auto' }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary bar */}
      <div className="summary-bar">
        <div className="summary-stat"><span className="summary-stat-label">Total Income</span><span className="summary-stat-value" style={{ color: 'var(--income)' }}>{formatCurrency(totalIncome)}</span></div>
        <div className="summary-stat"><span className="summary-stat-label">Total Expenses</span><span className="summary-stat-value" style={{ color: 'var(--expense)' }}>{formatCurrency(totalExpense)}</span></div>
        <div className="summary-stat"><span className="summary-stat-label">Net Balance</span><span className="summary-stat-value" style={{ color: 'var(--accent)' }}>{formatCurrency(totalIncome - totalExpense)}</span></div>
        <div className="summary-stat" style={{ marginLeft: 'auto' }}><span className="summary-stat-label">Showing</span><span className="summary-stat-value" style={{ fontSize: 13 }}>{filtered.length} transactions</span></div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No transactions found</td></tr>
                : paged.map(tx => <TransactionRow key={tx.id} tx={tx} onEdit={openEdit} onDelete={deleteTransaction} />)}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </div>
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} editTx={editTx} />}
    </div>
  );
}
