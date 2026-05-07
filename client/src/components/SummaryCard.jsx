import { formatCurrency } from '../utils/formatCurrency';

export default function SummaryCard({ label, value, icon: Icon, accentColor, subtext, subtextColor, isCurrency = true, isPercent = false }) {
  return (
    <div className="summary-card" style={{ '--card-accent': accentColor }}>
      <div className="summary-card-header">
        <span className="summary-label">{label}</span>
        <div className="summary-icon" style={{ background: accentColor + '22', color: accentColor }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="summary-value">
        {isCurrency ? formatCurrency(value) : isPercent ? `${value}%` : value}
      </div>
      {subtext && (
        <div className="summary-sub" style={subtextColor ? { color: subtextColor } : {}}>
          {subtext}
        </div>
      )}
    </div>
  );
}
