
import React from 'react';
import { InfluencerMetric } from '../types';

interface MetricsCardProps {
  metric: InfluencerMetric;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metric }) => {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up': return <i className="fa-solid fa-caret-up text-[10px]"></i>;
      case 'down': return <i className="fa-solid fa-caret-down text-[10px]"></i>;
      default: return null;
    }
  };

  const trendColorClass = metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'down' ? 'text-rose-500' : 'text-slate-400';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100/80 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col h-full justify-between">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 line-clamp-1">
          {metric.label}
        </span>
        <div className="flex items-end justify-between gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-none">
            {metric.value}
          </span>
          {metric.percentage && (
            <div className={`flex items-center gap-1 font-bold text-[11px] sm:text-xs mb-0.5 ${trendColorClass}`}>
              {getTrendIcon()}
              <span>{metric.percentage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
