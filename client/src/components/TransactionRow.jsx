import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { CATEGORY_COLORS } from '../utils/categoryColors';
import CategoryBadge from './CategoryBadge';
import { Pencil, Trash2 } from 'lucide-react';

export default function TransactionRow({ tx, onEdit, onDelete }) {
  const catInfo = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Others;
  const isIncome = tx.type === 'income';

  return (
    <tr>
      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(tx.date)}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: catInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            {catInfo.emoji}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{tx.title}</div>
            {tx.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.notes}</div>}
          </div>
        </div>
      </td>
      <td className="hide-mobile"><CategoryBadge category={tx.category} /></td>
      <td>
        <span className={`badge-pill ${isIncome ? 'badge-income' : 'badge-rent'}`} style={isIncome ? {} : { background: 'rgba(220,38,38,0.1)', color: 'var(--expense)' }}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td className={isIncome ? 'amount-income' : 'amount-expense'}>
        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
      </td>
      <td className="hide-mobile">
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="icon-btn" onClick={() => onEdit(tx)} title="Edit"><Pencil size={15} /></button>
          <button className="icon-btn" onClick={() => onDelete(tx.id)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}
