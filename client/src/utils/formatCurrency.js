// Format number in Indian numbering system
export function formatCurrency(amount, showDecimal = true) {
  if (amount === null || amount === undefined) return '₹0.00';
  const num = parseFloat(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
  }).format(Math.abs(num));
  return `₹${formatted}`;
}

export function formatCurrencySigned(amount) {
  const num = parseFloat(amount);
  const prefix = num >= 0 ? '+' : '-';
  return `${prefix}${formatCurrency(Math.abs(num))}`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}
