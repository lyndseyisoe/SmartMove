import { format } from 'date-fns';

export function formatKES(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return `KES ${Number(amount).toLocaleString('en-KE')}`;
}

export function formatDate(dateInput, pattern = 'd MMM yyyy') {
  if (!dateInput) return '—';
  try {
    return format(new Date(dateInput), pattern);
  } catch {
    return '—';
  }
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}
