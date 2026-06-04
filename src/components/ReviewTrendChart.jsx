import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ReviewTrendChart({ problems }) {
  const chartData = useMemo(() => {
    const counts = {};
    problems.forEach((p) => {
      counts[p.dateSolved] = (counts[p.dateSolved] || 0) + 1;
    });
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const displayStr = `${d.getMonth() + 1}/${d.getDate()}`;
      data.push({
        date: displayStr,
        fullDate: dateStr,
        count: counts[dateStr] || 0,
      });
    }
    return data;
  }, [problems]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>近30天刷题趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`刷题数量：${value} 道`, '']}
                labelFormatter={(label) => `日期：${label}`}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
