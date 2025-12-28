
import React from 'react';
import { AnalysisReport, Language } from '../types';
import MetricsCard from './MetricsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ReportViewProps {
  report: AnalysisReport;
  onReset: () => void;
  lang: Language;
}

const translations = {
  ko: {
    scoreLabel: '영향력 점수',
    percentilePrefix: '상위',
    percentileSuffix: '%',
    resetButton: '다시 분석하기',
    dnaHeader: '콘텐츠 DNA',
    sentimentHeader: '오디언스 반응',
    growthHeader: '성장 전략 가이드',
    futureHeader: '미래 확장성 및 트렌드',
    collabHeader: '브랜드 협업 가이드',
    sourcesHeader: '참고 자료',
    sentiment: { pos: '긍정', neu: '중립', neg: '부정' }
  },
  en: {
    scoreLabel: 'Influence Score',
    percentilePrefix: 'Top',
    percentileSuffix: '%',
    resetButton: 'Analyze Again',
    dnaHeader: 'Content DNA',
    sentimentHeader: 'Audience Sentiment',
    growthHeader: 'Growth Roadmap',
    futureHeader: 'Scalability & Trend',
    collabHeader: 'Brand Collab Guide',
    sourcesHeader: 'References',
    sentiment: { pos: 'Pos', neu: 'Neu', neg: 'Neg' }
  },
  ja: {
    scoreLabel: '影響力スコア',
    percentilePrefix: '上位',
    percentileSuffix: '%',
    resetButton: '再分析する',
    dnaHeader: 'コンテンツDNA',
    sentimentHeader: 'ユーザーの反応',
    growthHeader: '成長戦略ガイド',
    futureHeader: '将来性とトレンド',
    collabHeader: 'タイアップガイド',
    sourcesHeader: 'リファレンス',
    sentiment: { pos: '肯定', neu: '中立', neg: '否定' }
  },
  zh: {
    scoreLabel: '影响力评分',
    percentilePrefix: '前',
    percentileSuffix: '%',
    resetButton: '重新分析',
    dnaHeader: '内容 DNA',
    sentimentHeader: '受众反应',
    growthHeader: '增长战略指南',
    futureHeader: '未来扩张性',
    collabHeader: '品牌合作指南',
    sourcesHeader: '参考资料',
    sentiment: { pos: '正面', neu: '中性', neg: '负面' }
  },
  vi: {
    scoreLabel: 'Điểm ảnh hưởng',
    percentilePrefix: 'Top',
    percentileSuffix: '%',
    resetButton: 'Phân tích lại',
    dnaHeader: 'DNA nội dung',
    sentimentHeader: 'Phản ứng khán giả',
    growthHeader: 'Chiến lược phát triển',
    futureHeader: 'Xu hướng tương lai',
    collabHeader: 'Hướng dẫn hợp tác',
    sourcesHeader: 'Tài liệu tham khảo',
    sentiment: { pos: 'Tích cực', neu: 'Trung lập', neg: 'Tiêu cực' }
  }
};

const ReportView: React.FC<ReportViewProps> = ({ report, onReset, lang }) => {
  const t = translations[lang];

  const sentimentData = [
    { name: t.sentiment.pos, value: report.sentiment.positive || 0, color: '#22c55e' },
    { name: t.sentiment.neu, value: report.sentiment.neutral || 0, color: '#94a3b8' },
    { name: t.sentiment.neg, value: report.sentiment.negative || 0, color: '#ef4444' },
  ];

  const pillarData = (report.contentPillars || []).map(p => ({
    name: p.topic,
    value: p.weight
  }));

  const percentile = 100 - Math.round((report.score || 0) / 1.1);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-12 sm:pb-20">
      {/* 상단 헤더 섹션 */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{report.influencerName}</h1>
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs font-bold rounded-md">
                {report.platformName}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] sm:text-xs font-bold rounded-md">
                {report.niche}
              </span>
            </div>
          </div>
          <p className="text-sm sm:text-lg text-slate-500 leading-relaxed max-w-3xl">{report.profileSummary}</p>
        </div>
        
        <div className="flex items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 self-start sm:self-auto min-w-[160px] sm:min-w-[200px]">
          <div className="flex-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t.scoreLabel}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-indigo-600">{report.score}</span>
              <span className="text-[10px] sm:text-xs font-bold text-indigo-400">/ 100</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-100 mx-1"></div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t.percentilePrefix}</span>
            <span className="text-lg sm:text-xl font-bold text-slate-700">{percentile}{t.percentileSuffix}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Performance Metrics</h2>
        <button 
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
        >
          <i className="fa-solid fa-rotate-left"></i> {t.resetButton}
        </button>
      </div>

      {/* 지표 그리드: 모바일 2열, 테블릿 이상 4열 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2">
        {report.metrics.map((m, idx) => (
          <MetricsCard key={idx} metric={m} />
        ))}
      </div>

      {/* 차트 섹션: DNA & 감성 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 px-2">
        <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-dna text-sm sm:text-xl"></i>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800">{t.dnaHeader}</h2>
          </div>
          <div className="h-[200px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(report.contentPillars || []).slice(0, 3).map((p, idx) => (
              <div key={idx} className="p-3 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{p.topic}</h4>
                  <span className="text-[10px] font-black text-indigo-500">{p.weight}%</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
              <i className="fa-solid fa-face-smile text-sm sm:text-xl"></i>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800">{t.sentimentHeader}</h2>
          </div>
          <div className="flex-1 min-h-[200px] sm:min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 sm:p-6 bg-indigo-50/50 rounded-xl sm:rounded-2xl border border-indigo-100/50 italic text-slate-700 text-xs sm:text-sm leading-relaxed relative mt-4">
            <i className="fa-solid fa-quote-left absolute -top-2 -left-1 text-indigo-200 text-xl"></i>
            "{report.sentiment?.summary}"
          </div>
        </div>
      </div>

      {/* 성장 전략 가이드 */}
      <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 px-2 mx-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
            <i className="fa-solid fa-rocket text-sm sm:text-xl"></i>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-800">{t.growthHeader}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {(report.growthStrategy || []).map((step, idx) => (
            <div key={idx} className="relative p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
              <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                {idx + 1}
              </div>
              <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-2 mt-1">{step.title}</h4>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 브랜드 및 트렌드 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 px-2">
        <div className="lg:col-span-2 glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <i className="fa-solid fa-chart-line text-sm sm:text-xl"></i>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800">{t.futureHeader}</h2>
          </div>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100">
            {report.scalabilityGuide}
          </p>
        </div>

        <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5">
          <h3 className="text-base sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-handshake text-indigo-500 text-sm sm:text-lg"></i>
            {t.collabHeader}
          </h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(report.brandAffinity || []).map((brand, idx) => (
                <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] sm:text-xs font-bold border border-indigo-100">
                  #{brand}
                </span>
              ))}
            </div>
            <ul className="space-y-2.5">
              {(report.recommendations || []).map((rec, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <div className="mt-1 flex-shrink-0 w-4 h-4 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[8px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <p className="text-slate-600 text-[11px] sm:text-xs font-medium leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 분석 출처 */}
      {report.sources && report.sources.length > 0 && (
        <div className="px-2">
          <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-indigo-400"></i>
              {t.sourcesHeader}
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-2 shadow-sm"
                >
                  <i className="fa-solid fa-link text-[8px]"></i>
                  {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
