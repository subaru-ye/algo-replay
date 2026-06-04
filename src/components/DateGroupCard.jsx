import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MASTERY_CONFIG } from '@/lib/review';
import { MasteryBadge } from '@/components/MasteryBadge';
import { AttemptBlocks } from '@/components/AttemptBlocks';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DateGroupCard({ date, list, isOpen, onToggle, onDelete, onAddAttempt }) {
  const counts = {};
  list.forEach((p) => { counts[p.masteryLevel] = (counts[p.masteryLevel] || 0) + 1; });

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-md text-sm">
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>共 {list.length} 道</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:flex gap-2">
              {Object.entries(counts).map(([level, count]) => (
                <span key={level} className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${MASTERY_CONFIG[level]?.color.split(' ')[0] || 'bg-gray-300'}`} />
                  {MASTERY_CONFIG[level]?.label || level} {count}
                </span>
              ))}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t px-5 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">题号</TableHead>
                <TableHead>题目名称</TableHead>
                <TableHead className="w-36">刷题记录</TableHead>
                <TableHead className="w-32">掌握程度</TableHead>
                <TableHead className="text-right w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.problemNumber}</TableCell>
                  <TableCell className="font-medium">{p.problemName}</TableCell>
                  <TableCell>
                    <AttemptBlocks attempts={p.attempts || []} onAdd={(level) => onAddAttempt(p.id, level)} />
                  </TableCell>
                  <TableCell>
                    <MasteryBadge level={p.masteryLevel} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/edit/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(p.id);
                        }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
