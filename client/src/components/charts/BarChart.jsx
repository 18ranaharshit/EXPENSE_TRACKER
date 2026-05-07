import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow)' }}>
      <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill, fontSize: 13 }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function BarChart({ data, currentMonth }) {
  const now = new Date().getMonth();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReBarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="income" name="Income" fill="#7C3AED" radius={[4,4,0,0]}>
          {data.map((_, i) => <Cell key={i} fill={i <= now ? '#7C3AED' : 'rgba(124,58,237,0.25)'} />)}
        </Bar>
        <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[4,4,0,0]}>
          {data.map((_, i) => <Cell key={i} fill={i <= now ? '#EF4444' : 'rgba(239,68,68,0.25)'} />)}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}
