
import React from 'react';
import { InfluencerMetric } from '../types';

interface MetricsCardProps {
  metric: InfluencerMetric;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metric }) => {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up': return <i className="fa-solid fa-caret-up text-green-500"></i>;
      case 'down': return <i className="fa-solid fa-caret-down text-red-500"></i>;
      default: return null;
    }
  };

  return (
    <div className="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col justify-between transition-all hover:shadow-lg border border-slate-100">
      <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 line-clamp-1">{metric.label}</span>
      <div className="flex items-end justify-between gap-1">
        <span className="text-lg sm:text-2xl font-black text-slate-800 break-all">{metric.value}</span>
        <div className="flex flex-col items-end shrink-0">
          {metric.percentage && (
            <span className={`text-[9px] sm:text-xs font-bold ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {getTrendIcon()} {metric.percentage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
