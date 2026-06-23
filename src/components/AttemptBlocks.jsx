import { useState } from 'react';
import { MASTERY_CONFIG } from '@/lib/review';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const COLOR_MAP = {
  completely_lost: 'bg-red-500',
  saw_pattern: 'bg-orange-500',
  struggled_through: 'bg-amber-500',
  solved_independently: 'bg-blue-500',
  nailed_it: 'bg-emerald-500',
};

export function AttemptBlocks({ attempts, onAdd }) {
  const [open, setOpen] = useState(false);
  const isFull = attempts.length >= 5;

  const handleSelect = (level) => {
    onAdd(level);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      {attempts.map((a, i) => {
        const isLast = i === attempts.length - 1;
        const clickable = isFull && isLast;

        if (clickable) {
          return (
            <DropdownMenu key={i} open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-5 h-5 rounded-sm ${COLOR_MAP[a.masteryLevel]} ring-2 ring-offset-1 ring-blue-400`}
                  title={MASTERY_CONFIG[a.masteryLevel]?.label}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {Object.entries(MASTERY_CONFIG).map(([k, { label }]) => (
                  <DropdownMenuItem key={k} onClick={() => handleSelect(k)}>
                    <span className={`inline-block w-3 h-3 rounded-sm mr-2 ${COLOR_MAP[k]}`} />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <div
            key={i}
            className={`w-5 h-5 rounded-sm ${COLOR_MAP[a.masteryLevel] || 'bg-gray-300'}`}
            title={MASTERY_CONFIG[a.masteryLevel]?.label}
          />
        );
      })}

      {!isFull && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-5 h-5 rounded-sm border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors">
              +
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(MASTERY_CONFIG).map(([k, { label }]) => (
              <DropdownMenuItem key={k} onClick={() => handleSelect(k)}>
                <span className={`inline-block w-3 h-3 rounded-sm mr-2 ${COLOR_MAP[k]}`} />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
