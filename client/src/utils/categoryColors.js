export const CATEGORY_COLORS = {
  Food:          { bg: '#FEF3C7', text: '#D97706', dark_bg: 'rgba(217,119,6,0.2)',   dark_text: '#FCD34D', emoji: '🍽️' },
  Rent:          { bg: '#DBEAFE', text: '#1D4ED8', dark_bg: 'rgba(29,78,216,0.2)',   dark_text: '#93C5FD', emoji: '🏠' },
  Transport:     { bg: '#CCFBF1', text: '#0F766E', dark_bg: 'rgba(15,118,110,0.2)',  dark_text: '#5EEAD4', emoji: '🚗' },
  Entertainment: { bg: '#EDE9FE', text: '#7C3AED', dark_bg: 'rgba(124,58,237,0.2)', dark_text: '#C4B5FD', emoji: '🎬' },
  Health:        { bg: '#D1FAE5', text: '#059669', dark_bg: 'rgba(5,150,105,0.2)',   dark_text: '#6EE7B7', emoji: '💊' },
  Shopping:      { bg: '#FCE7F3', text: '#BE185D', dark_bg: 'rgba(190,24,93,0.2)',   dark_text: '#F9A8D4', emoji: '🛍️' },
  Utilities:     { bg: '#FEE2E2', text: '#DC2626', dark_bg: 'rgba(220,38,38,0.2)',   dark_text: '#FCA5A5', emoji: '⚡' },
  Income:        { bg: '#D1FAE5', text: '#059669', dark_bg: 'rgba(5,150,105,0.2)',   dark_text: '#6EE7B7', emoji: '💰' },
  Others:        { bg: '#F3F4F6', text: '#6B7280', dark_bg: 'rgba(107,114,128,0.2)', dark_text: '#9CA3AF', emoji: '📦' },
};

export const CHART_COLORS = ['#7C3AED','#EF4444','#F59E0B','#10B981','#3B82F6','#EC4899','#14B8A6','#8B5CF6'];

export function getCategoryClass(cat) {
  const map = { Food:'food', Rent:'rent', Transport:'transport', Entertainment:'entertainment', Health:'health', Shopping:'shopping', Utilities:'utilities', Income:'income', Others:'others' };
  return `badge-${map[cat] || 'others'}`;
}
