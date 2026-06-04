import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CalendarDays, Download, Upload } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { DateGroupCard } from '@/components/DateGroupCard';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ProblemList() {
  const { problems, remove, addAttempt, exportBackup, importBackup } = useProblems();
  const [openDates, setOpenDates] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  const grouped = useMemo(() => {
    const map = {};
    problems.forEach((p) => {
      if (!map[p.dateSolved]) map[p.dateSolved] = [];
      map[p.dateSolved].push(p);
    });
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, list]) => ({ date, list }));
  }, [problems]);

  const onDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      remove(deleteId);
      setDeleteId(null);
    }
  };

  const toggleDate = (date) => {
    setOpenDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]));
  };

  const handleExport = () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `algo-replay-backup-${backup.exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!window.confirm('导入备份会覆盖当前所有题目数据，确定继续吗？')) return;

    try {
      const text = await file.text();
      importBackup(JSON.parse(text));
      alert('导入成功');
    } catch (error) {
      alert(error instanceof Error ? error.message : '导入失败，请检查备份文件');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">全部题目</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} disabled={problems.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" />
            导入
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
          <Link to="/add">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              录入题目
            </Button>
          </Link>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg border">
          <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>暂无题目，快去录入吧</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(({ date, list }) => (
            <DateGroupCard
              key={date}
              date={date}
              list={list}
              isOpen={openDates.includes(date)}
              onToggle={() => toggleDate(date)}
              onDelete={onDelete}
              onAddAttempt={addAttempt}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这道题目吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
