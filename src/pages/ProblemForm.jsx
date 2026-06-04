import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { MASTERY_CONFIG, getToday } from '@/lib/review';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ProblemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { problems, add, update } = useProblems();
  const isEdit = !!id;
  const [form, setForm] = useState({ problemNumber: '', problemName: '', dateSolved: getToday(), masteryLevel: 'completely_lost' });

  useEffect(() => {
    if (isEdit) {
      const p = problems.find((x) => x.id === id);
      if (p) setForm({ problemNumber: p.problemNumber, problemName: p.problemName, dateSolved: p.dateSolved, masteryLevel: p.masteryLevel });
    }
  }, [id, problems, isEdit]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.problemNumber.trim() || !form.problemName.trim()) return;
    isEdit ? update(id, form) : add(form);
    navigate('/list');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold">{isEdit ? '编辑题目' : '录入新题目'}</h1>
      </div>

      <form onSubmit={submit} className="bg-white rounded-lg border p-6 max-w-xl space-y-6">
        <div className="space-y-2">
          <Label>题号</Label>
          <Input value={form.problemNumber} onChange={(e) => setForm((f) => ({ ...f, problemNumber: e.target.value }))} placeholder="例如：LeetCode 101" required />
        </div>

        <div className="space-y-2">
          <Label>题目名称</Label>
          <Input value={form.problemName} onChange={(e) => setForm((f) => ({ ...f, problemName: e.target.value }))} placeholder="例如：对称二叉树" required />
        </div>

        <div className="space-y-2">
          <Label>刷题日期</Label>
          <Input type="date" value={form.dateSolved} onChange={(e) => setForm((f) => ({ ...f, dateSolved: e.target.value }))} required />
        </div>

        <div className="space-y-3">
          <Label>解题掌握程度</Label>
          <RadioGroup value={form.masteryLevel} onValueChange={(v) => setForm((f) => ({ ...f, masteryLevel: v }))} className="gap-3">
            {Object.entries(MASTERY_CONFIG).map(([k, { label, color }]) => (
              <div key={k} className="flex items-center space-x-2">
                <RadioGroupItem value={k} id={k} />
                <Label htmlFor={k} className={`px-2 py-1 rounded text-sm font-medium cursor-pointer ${color}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/list')}>取消</Button>
          <Button type="submit">{isEdit ? '保存修改' : '确认录入'}</Button>
        </div>
      </form>
    </div>
  );
}
