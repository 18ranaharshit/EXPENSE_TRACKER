import { formatCurrency } from '../../utils/formatCurrency';

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getIntensity(amount, max) {
  if (!amount || !max) return 0;
  return Math.min(amount / max, 1);
}

export default function HeatmapCalendar({ heatmapData, month }) {
  const [year, mon] = (month || new Date().toISOString().slice(0,7)).split('-').map(Number);
  const monthIdx = mon - 1;
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const totalDays = getDaysInMonth(year, monthIdx);
  const values = Object.values(heatmapData || {});
  const max = values.length ? Math.max(...values) : 1;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(mon).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const amount = heatmapData?.[dateStr] || 0;
          const intensity = getIntensity(amount, max);
          const bg = intensity === 0
            ? 'var(--bg-secondary)'
            : `rgba(124,58,237,${0.1 + intensity * 0.85})`;
          return (
            <div key={dateStr} title={amount ? `${dateStr}: ${formatCurrency(amount)}` : dateStr}
              style={{ aspectRatio: '1', borderRadius: 4, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: intensity > 0.5 ? '#fff' : 'var(--text-muted)', cursor: amount ? 'pointer' : 'default', transition: 'all 0.2s' }}>
              {day}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No spend</span>
        {[0.1,0.3,0.5,0.7,0.9].map(v => (
          <div key={v} style={{ width: 16, height: 16, borderRadius: 3, background: `rgba(124,58,237,${v})` }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>High</span>
      </div>
    </div>
  );
}
