import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow)' }}>
      <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: 13 }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function LineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
        <Area type="monotone" dataKey="income" name="Income" stroke="#7C3AED" strokeWidth={2.5} fill="url(#incomeGrad)" dot={{ fill: '#7C3AED', r: 4 }} />
        <Area type="monotone" dataKey="expense" name="Expenses" stroke="#EF4444" strokeWidth={2.5} fill="url(#expenseGrad)" dot={{ fill: '#EF4444', r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
