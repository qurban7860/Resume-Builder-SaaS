import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';

export const AtsFeedbackWidget = () => {
  const { getDetailedScore } = useResumeStore();
  const { score, breakdown } = getDetailedScore();
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'success'>('all');

  const filteredItems = breakdown.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { label: 'Top 1% Standard', color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Outstanding! Your resume meets the top industry standards.' };
    if (score >= 75) return { label: 'Strong Competitor', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Good structure. A few minor tweaks will make it elite.' };
    return { label: 'Needs Optimization', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', desc: 'Critical sections are missing details. Follow suggestions below.' };
  };

  const grade = getScoreGrade(score);

  // SVG parameters for radial progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Widget Header with Gauge */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🎯 ATS Scoring Engine</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold uppercase tracking-wider">V2.0</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Radial Progress SVG */}
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-gray-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-blue-600 transition-all duration-500 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800">{score}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          {/* Grade / Overview */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h3 className="text-md font-bold text-slate-800">Review Result:</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${grade.bg} ${grade.color}`}>
                {grade.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">{grade.desc}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex gap-2 overflow-x-auto">
        {(['all', 'error', 'warning', 'success'] as const).map((tab) => {
          const count = breakdown.filter(item => tab === 'all' || item.type === tab).length;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          const activeClass = 
            tab === 'all' ? 'bg-slate-800 text-white' :
            tab === 'error' ? 'bg-red-600 text-white' :
            tab === 'warning' ? 'bg-amber-500 text-white' :
            'bg-green-600 text-white';

          const inactiveClass =
            tab === 'all' ? 'hover:bg-slate-100 text-slate-600' :
            tab === 'error' ? 'hover:bg-red-50 text-red-600' :
            tab === 'warning' ? 'hover:bg-amber-50 text-amber-600' :
            'hover:bg-green-50 text-green-600';

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                filter === tab ? activeClass : inactiveClass
              }`}
            >
              <span>{label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Checklist Recommendations */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No items in this category.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isError = item.type === 'error';
            const isWarning = item.type === 'warning';
            const isSuccess = item.type === 'success';

            return (
              <div
                key={item.id}
                className={`p-4 transition-colors duration-150 hover:bg-slate-50 flex gap-3.5 items-start ${
                  isError ? 'bg-red-50/10' : isWarning ? 'bg-amber-50/5' : ''
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isSuccess && (
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">✓</span>
                  )}
                  {isWarning && (
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">!</span>
                  )}
                  {isError && (
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">✕</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">{item.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">{item.description}</p>
                </div>

                {/* Score badge */}
                <div className="shrink-0 text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    item.score > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.score > 0 ? `+${item.score}` : '0'}/{item.maxScore}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
