export function isAfter(target: string | number | Date, reference: string | number | Date): boolean {
  const t = new Date(target).getTime();
  const r = new Date(reference).getTime();
  if (Number.isNaN(t) || Number.isNaN(r)) return false;
  return t >= r;
}

export function formatRelativeDate(dateString: string): string {
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return '';
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const diffMs = target.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) > 30) {
    return target.toLocaleDateString();
  }
  return formatter.format(diffDays, 'day');
}
