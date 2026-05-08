import { useState, useEffect } from 'react';
import BarChart from '../components/charts/BarChart';
import HeatmapCalendar from '../components/charts/HeatmapCalendar';
import { formatCurrency } from '../utils/formatCurrency';
import { CHART_COLORS } from '../utils/categoryColors';
import { Download, Sparkles, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function CircularProgress({ pct, size = 140, stroke = 12 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  );
}

export default function Analytics() {
  const month = new Date().toISOString().slice(0, 7);
  const [monthly, setMonthly] = useState([]);
  const [cats, setCats] = useState({ categories: [], total: 0 });
  const [heatmap, setHeatmap] = useState({});

  useEffect(() => {
    fetch(`${API}/analytics/monthly`, { credentials: 'include' }).then(r => r.json()).then(setMonthly).catch(() => { });
    fetch(`${API}/analytics/categories?month=${month}`, { credentials: 'include' }).then(r => r.json()).then(setCats).catch(() => { });
    fetch(`${API}/analytics/heatmap?month=${month}`, { credentials: 'include' }).then(r => r.json()).then(setHeatmap).catch(() => { });
  }, [month]);

  const savingsPct = 62;
  const savedAmt = 15500;
  const goalAmt = 25000;

  return (
    <div className="page-content">
      {/* Top controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="segmented">
          <button className="active">Monthly</button>
          <button>Yearly</button>
        </div>
        <button className="btn btn-outline btn-sm"><Download size={15} /> Download Report</button>
      </div>

      {/* Row 1: Trend + Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '65fr 35fr', gap: 16, marginBottom: 16 }}>
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Monthly Spending Trend - 2026</h3>
          <BarChart data={monthly} />
        </div>
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Month vs Last Month</h3>
          {[
            { label: 'Total Spend', last: 24800, curr: 28340, unit: '₹', better: false },
            { label: 'Largest Category', last: 'Rent', curr: 'Rent', unit: '', better: true },
            { label: 'Avg per Day', last: 826, curr: 944, unit: '₹', better: false },
            { label: 'Transactions', last: 18, curr: 20, unit: '', better: false },
          ].map(({ label, last, curr, unit, better }) => {
            const isNum = typeof last === 'number';
            const pct = isNum ? Math.round(Math.abs((curr - last) / last) * 100) : null;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit}{isNum ? last.toLocaleString('en-IN') : last}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{unit}{isNum ? curr.toLocaleString('en-IN') : curr}</span>
                  {pct !== null && <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 999, fontWeight: 700, background: better ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: better ? 'var(--success)' : 'var(--danger)' }}>{better ? '▲' : '▼'}{pct}%</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Categories + Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '40fr 60fr', gap: 16, marginBottom: 16 }}>
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Top Spending Categories</h3>
          {cats.categories.slice(0, 5).map((c, i) => (
            <div key={c.category} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{c.category}</span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatCurrency(c.amount)}</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${c.percentage}%`, background: CHART_COLORS[i] }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{c.count} transactions · {c.percentage}%</div>
            </div>
          ))}
        </div>
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Spending Heatmap - This Month</h3>
          <HeatmapCalendar heatmapData={heatmap} month={month} />
        </div>
      </div>

      {/* Row 3: Savings Goal + AI Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card card-body" style={{ textAlign: 'center' }}>
          <h3 className="section-title" style={{ marginBottom: 20 }}>Savings Goal</h3>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <CircularProgress pct={savingsPct} />
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(savedAmt)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>saved</div>
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>Goal: {formatCurrency(goalAmt)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>by 31 May 2026</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${savingsPct}%`, background: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{savingsPct}% of goal reached</div>
        </div>
        <div className="card card-body">
          <h3 className="section-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} style={{ color: 'var(--warning)' }} /> AI Insights
          </h3>
          {[
            { icon: AlertTriangle, color: 'var(--warning)', title: 'Food Spending Up', text: 'Food spending is 18% above your monthly average. Consider meal planning to reduce costs.' },
            { icon: CheckCircle, color: 'var(--success)', title: 'Savings On Track', text: 'You are on track to meet your ₹25,000 savings goal for this month. Keep it up!' },
            { icon: Lightbulb, color: 'var(--accent)', title: 'Reduce Transport Cost', text: 'Your recurring cab expenses total ₹2,800. Consider carpooling or a monthly metro pass.' },
          ].map(({ icon: Icon, color, title, text }) => (
            <div key={title} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
