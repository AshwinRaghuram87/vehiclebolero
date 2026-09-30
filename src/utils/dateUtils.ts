import { DatePresetKey } from '../types/fleet';

export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatDayName = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  } catch {
    return '';
  }
};

export const getTodayString = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getPresetDateRange = (preset: DatePresetKey): { startDate: string; endDate: string } => {
  const today = new Date();
  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  switch (preset) {
    case 'today': {
      const dStr = toDateStr(today);
      return { startDate: dStr, endDate: dStr };
    }
    case 'yesterday': {
      const yDate = new Date(today);
      yDate.setDate(today.getDate() - 1);
      const dStr = toDateStr(yDate);
      return { startDate: dStr, endDate: dStr };
    }
    case 'last7days': {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 6);
      return { startDate: toDateStr(pastDate), endDate: toDateStr(today) };
    }
    case 'thisMonth': {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: toDateStr(firstDay), endDate: toDateStr(today) };
    }
    case 'lastMonth': {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return { startDate: toDateStr(firstDayLastMonth), endDate: toDateStr(lastDayLastMonth) };
    }
    case 'custom':
    default: {
      const past14 = new Date(today);
      past14.setDate(today.getDate() - 14);
      return { startDate: toDateStr(past14), endDate: toDateStr(today) };
    }
  }
};

export const isDateInRange = (dateStr: string, startDate: string, endDate: string): boolean => {
  if (!dateStr) return false;
  return dateStr >= startDate && dateStr <= endDate;
};

export const formatKm = (km: number): string => {
  if (km === undefined || km === null || isNaN(km)) return '0 km';
  return `${km.toLocaleString('en-IN')} km`;
};

export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};
