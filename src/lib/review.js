export const MASTERY_CONFIG = {
  completely_lost: { label: '完全不会', color: 'bg-red-100 text-red-700 border-red-200', schedule: [1, 3, 7, 15] },
  almost_there: { label: '差一点', color: 'bg-amber-100 text-amber-700 border-amber-200', schedule: [2, 5, 10] },
  perfect: { label: '完美完成', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', schedule: [] },
};

export function formatLocalDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function parseLocalDate(dateStr) {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getLocalDateTime() {
  const date = new Date();
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetMins = String(absOffset % 60).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${sec}${sign}${offsetHours}:${offsetMins}`;
}

export function calcReviewDates(baseDate, level) {
  const base = parseLocalDate(baseDate);
  return (MASTERY_CONFIG[level]?.schedule || []).map((d) => {
    const date = new Date(base);
    date.setDate(date.getDate() + d);
    return formatLocalDate(date);
  });
}

export function getToday() {
  return formatLocalDate(new Date());
}
