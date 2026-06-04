import { MASTERY_CONFIG } from '@/lib/review';

export function MasteryBadge({ level }) {
  const c = MASTERY_CONFIG[level];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
      {c.label}
    </span>
  );
}
