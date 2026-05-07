import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { CHART_COLORS } from '../../utils/categoryColors';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow)' }}>
      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill, fontSize: 13 }}>{formatCurrency(payload[0].value)} ({payload[0].payload.percentage}%)</p>
    </div>
  );
};

const renderLabel = ({ cx, cy, total }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
    <tspan x={cx} dy="-6" style={{ fill: 'var(--text-muted)', fontSize: 11 }}>Total</tspan>
    <tspan x={cx} dy="20" style={{ fill: 'var(--text-primary)', fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>₹{(total/1000).toFixed(1)}k</tspan>
  </text>
);

export default function DonutChart({ data, total }) {
  const colored = data.map((d, i) => ({ ...d, fill: CHART_COLORS[i % CHART_COLORS.length] }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={colored} cx="40%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="amount" nameKey="category"
          label={(props) => renderLabel({ ...props, total })} labelLine={false}>
          {colored.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend layout="vertical" align="right" verticalAlign="middle"
          formatter={(value, entry) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value} {entry.payload.percentage}%</span>}
          iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
