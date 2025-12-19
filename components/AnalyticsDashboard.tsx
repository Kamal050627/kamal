
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { ReviewEntry, SentimentType, SentimentStats } from '../types';

interface AnalyticsDashboardProps {
  reviews: ReviewEntry[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ reviews }) => {
  const stats: SentimentStats = useMemo(() => {
    const completed = reviews.filter(r => r.status === 'completed' && r.analysis);
    const total = completed.length;
    
    if (total === 0) {
      return { total: 0, positive: 0, negative: 0, neutral: 0, averageScore: 0 };
    }

    const positive = completed.filter(r => r.analysis?.sentiment === SentimentType.POSITIVE).length;
    const negative = completed.filter(r => r.analysis?.sentiment === SentimentType.NEGATIVE).length;
    const neutral = completed.filter(r => r.analysis?.sentiment === SentimentType.NEUTRAL).length;
    const averageScore = completed.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0) / total;

    return { total, positive, negative, neutral, averageScore };
  }, [reviews]);

  const pieData = [
    { name: 'Positive', value: stats.positive, color: '#10b981' },
    { name: 'Neutral', value: stats.neutral, color: '#f59e0b' },
    { name: 'Negative', value: stats.negative, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const aspectData = useMemo(() => {
    const counts: Record<string, number> = {};
    reviews.forEach(r => {
      r.analysis?.keyAspects.forEach(aspect => {
        const lower = aspect.toLowerCase();
        counts[lower] = (counts[lower] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [reviews]);

  if (stats.total === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-chart-line text-slate-300 text-3xl"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Analytics Data Yet</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Start adding customer reviews to generate live sentiment insights and product performance metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Analyzed</p>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Satisfaction Score</p>
          <p className="text-3xl font-black text-indigo-600">{Math.round(stats.averageScore * 100)}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Positive Index</p>
          <p className="text-3xl font-black text-emerald-600">{Math.round((stats.positive / stats.total) * 100)}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Negative Rate</p>
          <p className="text-3xl font-black text-rose-600">{Math.round((stats.negative / stats.total) * 100)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center">
            <i className="fa-solid fa-chart-pie mr-2 text-indigo-500"></i>
            Sentiment Distribution
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center">
            <i className="fa-solid fa-list-check mr-2 text-indigo-500"></i>
            Top Mentioned Aspects
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspectData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
