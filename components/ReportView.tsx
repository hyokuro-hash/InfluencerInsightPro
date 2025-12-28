
import React from 'react';
import { AnalysisReport, Language } from '../types';
import MetricsCard from './MetricsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ReportViewProps {
  report: AnalysisReport;
  onReset: () => void;
  lang: Language;
  originalUrl: string; // 사용자가 입력한 원본 URL 추가
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
    liveBrowserTitle: 'AI 실시간 스캔 윈도우',
    verifiedLabel: '실시간 데이터 검증됨',
    posts: '게시물',
    followers: '팔로워',
    following: '팔로우',
    sentiment: { pos: '긍정', neu: '중립', neg: '부정' }
  },
  en: {
    scoreLabel: 'Influence Score',
    percentilePrefix: 'Top',
    percentileSuffix: '%',
    resetButton: 'Re-analyze',
    dnaHeader: 'Content DNA',
    sentimentHeader: 'Audience Sentiment',
    growthHeader: 'Growth Roadmap',
    futureHeader: 'Scalability & Trend',
    collabHeader: 'Brand Collab Guide',
    liveBrowserTitle: 'AI Live Scan Window',
    verifiedLabel: 'Real-time Data Verified',
    posts: 'Posts',
    followers: 'Followers',
    following: 'Following',
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
    liveBrowserTitle: 'AIリアルタイムスキャン',
    verifiedLabel: 'リアルタイムデータ検証済み',
    posts: '投稿',
    followers: 'フォロワー',
    following: 'フォロー',
    sentiment: { pos: '肯定', neu: '中立', neg: '否定' }
  }
};

const ReportView: React.FC<ReportViewProps> = ({ report, onReset, lang, originalUrl }) => {
  const t = (translations[lang as keyof typeof translations] || translations.ko) as any;

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
      {/* 라이브 브라우저 스캔 섹션 (상단 좌측 배치) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
        <div className="lg:col-span-6 xl:col-span-5">
          {/* Mock Browser Window */}
          <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-indigo-100/50 flex flex-col h-full min-h-[420px]">
            {/* Browser Header */}
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
              </div>
              <div className="flex-1 bg-white rounded-md border border-slate-200 px-3 py-1 flex items-center gap-2 overflow-hidden shadow-inner">
                <i className="fa-solid fa-shield-halved text-[10px] text-emerald-500"></i>
                <span className="text-[10px] font-bold text-slate-500 truncate tracking-tight">
                  {originalUrl}
                </span>
              </div>
              <i className="fa-solid fa-rotate-right text-slate-300 text-[10px] cursor-pointer hover:text-indigo-500 transition-colors"></i>
            </div>
            
            {/* Browser Body (AI Scanned Content Simulation) */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 bg-white relative overflow-hidden">
              {/* Scan Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>
              
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-50 p-1 bg-white shadow-xl overflow-hidden relative z-10 group">
                  {report.profileHeader.imageUrl ? (
                    <img src={report.profileHeader.imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                      <i className="fa-solid fa-user text-3xl"></i>
                    </div>
                  )}
                  {/* AI Scanning Visual */}
                  <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white z-20 shadow-lg">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
              </div>

              <div className="text-center space-y-1 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{report.influencerName}</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                  {report.platformName} Verified Profile
                </p>
              </div>

              <div className="w-full grid grid-cols-3 gap-2 border-y border-slate-100 py-6 relative z-10">
                <div className="text-center space-y-1">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.posts}</span>
                  <span className="text-xl font-black text-slate-800 tabular-nums">{report.profileHeader.posts}</span>
                </div>
                <div className="text-center space-y-1 border-x border-slate-100">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.followers}</span>
                  <span className="text-xl font-black text-indigo-600 tabular-nums">{report.profileHeader.followers}</span>
                </div>
                <div className="text-center space-y-1">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.following}</span>
                  <span className="text-xl font-black text-slate-800 tabular-nums">{report.profileHeader.following}</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3 relative z-10 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-400">
                  <i className="fa-solid fa-microchip text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black text-white leading-tight">{t.verifiedLabel}</p>
                  <p className="text-[9px] font-bold text-slate-400">AI scanned & validated header metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 분석 데이터 섹션 (오른쪽 배치) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">{report.influencerName}</h1>
              <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
                {report.niche}
              </span>
            </div>
            <p className="text-base sm:text-xl text-slate-500 leading-relaxed font-medium">
              {report.profileSummary}
            </p>
          </div>

          <div className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 self-start w-full sm:w-auto hover:shadow-xl hover:shadow-indigo-50/50 transition-shadow">
            <div className="space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.scoreLabel}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-indigo-600 tracking-tighter">{report.score}</span>
                <span className="text-sm font-bold text-indigo-300">/ 100</span>
              </div>
            </div>
            <div className="h-16 w-[2px] bg-slate-100 rounded-full"></div>
            <div className="space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.percentilePrefix}</span>
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{percentile}{t.percentileSuffix}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 실시간 지표 요약 (가로 카드) */}
      <div className="flex justify-between items-center px-4 pt-10 border-t border-slate-100/50">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
          AUDIT METRICS BREAKDOWN
        </h2>
        <button onClick={onReset} className="text-indigo-600 hover:text-indigo-800 text-xs font-black flex items-center gap-2 transition-transform hover:scale-105">
          <i className="fa-solid fa-rotate-right"></i> {t.resetButton}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
        {report.metrics.map((m, idx) => (
          <MetricsCard key={idx} metric={m} />
        ))}
      </div>

      {/* 심층 분석 섹션 (DNA & 감성) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <div className="glass-card p-8 rounded-[2.5rem] space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-fingerprint text-xl"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.dnaHeader}</h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {(report.contentPillars || []).slice(0, 3).map((p, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:border-indigo-100 group">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{p.topic}</h4>
                  <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{p.weight}%</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed font-bold">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] space-y-8 flex flex-col shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-100">
              <i className="fa-solid fa-heart text-xl"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.sentimentHeader}</h2>
          </div>
          <div className="flex-1 min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value">
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{paddingTop: '30px', fontSize: '12px', fontWeight: '900'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="p-7 bg-indigo-50/50 rounded-3xl border border-indigo-100 italic text-slate-700 text-sm sm:text-base leading-relaxed relative mt-4 font-bold">
            <i className="fa-solid fa-quote-left absolute -top-4 -left-2 text-indigo-200 text-4xl opacity-50"></i>
            "{report.sentiment?.summary}"
          </div>
        </div>
      </div>

      {/* 성장 전략 섹션 */}
      <div className="px-4">
        <div className="glass-card p-8 sm:p-12 rounded-[3rem] space-y-12 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100">
              <i className="fa-solid fa-map text-3xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t.growthHeader}</h2>
              <p className="text-sm font-bold text-slate-400">데이터 기반 도약 전략</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(report.growthStrategy || []).map((step, idx) => (
              <div key={idx} className="relative p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 transition-all hover:scale-[1.02] hover:bg-white hover:shadow-xl hover:shadow-slate-100 group">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg mb-6 group-hover:rotate-12 transition-transform">
                  0{idx + 1}
                </div>
                <h4 className="font-black text-slate-900 text-lg mb-4 tracking-tight">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-bold">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 확장성 & 협업 가이드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] space-y-8 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-amber-100">
              <i className="fa-solid fa-rocket-launch text-2xl"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t.futureHeader}</h2>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 leading-loose text-slate-600 font-bold text-lg">
            {report.scalabilityGuide}
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] space-y-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <i className="fa-solid fa-briefcase text-indigo-600"></i>
              {t.collabHeader}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(report.brandAffinity || []).map((brand, idx) => (
                <span key={idx} className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-indigo-100">
                  {brand}
                </span>
              ))}
            </div>
            <ul className="space-y-5">
              {(report.recommendations || []).map((rec, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-black border border-emerald-100">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <p className="text-slate-600 text-sm font-black leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8 border-t border-slate-100">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm transition-all hover:bg-indigo-600 shadow-xl shadow-slate-200">
              전문가 상담 예약하기
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ReportView;
