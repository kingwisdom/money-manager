export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr.length <= 10 ? dateStr + 'T00:00:00' : dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function monthInputValue(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function currentMonthLabel(): string {
  return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function dueLabel(days: number): { text: string; tone: 'overdue' | 'today' | 'soon' | 'ok' } {
  if (days < 0) return { text: `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`, tone: 'overdue' };
  if (days === 0) return { text: 'Due today', tone: 'today' };
  if (days === 1) return { text: 'Due tomorrow', tone: 'soon' };
  return { text: `${days} days left`, tone: 'ok' };
}