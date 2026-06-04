import { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, PlusCircle } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { MASTERY_CONFIG, getToday } from '@/lib/review';
import { MasteryBadge } from '@/components/MasteryBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ReviewTrendChart = lazy(() =>
  import('@/components/ReviewTrendChart').then((module) => ({ default: module.ReviewTrendChart }))
);

export default function Index() {
  const { problems, getTodayProblems, addAttempt } = useProblems();
  const today = getToday();
  const reviews = getTodayProblems(today);
  const [open, setOpen] = useState(false);
  const [sid, setSid] = useState(null);
  const [level, setLevel] = useState('');

  const startReview = (id, cur) => { setSid(id); setLevel(cur); setOpen(true); };
  const finishReview = () => { if (sid && level) { addAttempt(sid, level); setOpen(false); } };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">每日复盘看板</h1>
        <Link to="/add">
          <Button className="w-full h-14 text-base gap-2" variant="outline">
            <PlusCircle className="h-5 w-5" />
            录入新题目
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">今日复盘任务</h2>
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
            <BookOpen className="h-10 w-10 mx-auto text-gray-300 mb-3" />
            <p>今日没有需要复盘的题目，继续保持！</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {reviews.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="bg-gray-100 text-gray-700 font-mono text-sm px-2.5 py-1 rounded">{p.problemNumber}</div>
                  <div>
                    <div className="font-medium">{p.problemName}</div>
                    <div className="text-sm text-gray-500 mt-0.5">上次刷题：{p.dateSolved}</div>
                  </div>
                  <MasteryBadge level={p.masteryLevel} />
                </div>
                <Button size="sm" onClick={() => startReview(p.id, p.masteryLevel)}><CheckCircle2 className="h-4 w-4 mr-1" />完成复盘</Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Suspense fallback={<div className="h-64 rounded-lg border bg-white" />}>
        <ReviewTrendChart problems={problems} />
      </Suspense>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>更新掌握程度</DialogTitle></DialogHeader>
          <div className="py-4">
            <RadioGroup value={level} onValueChange={setLevel} className="gap-3">
              {Object.entries(MASTERY_CONFIG).map(([k, { label, color }]) => (
                <div key={k} className="flex items-center space-x-2">
                  <RadioGroupItem value={k} id={k} />
                  <Label htmlFor={k} className={`px-2 py-1 rounded text-sm font-medium cursor-pointer ${color}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={finishReview}>确认更新</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
