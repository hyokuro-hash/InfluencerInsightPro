
import React from 'react';
import { AnalysisReport, Language } from '../types';
import MetricsCard from './MetricsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ReportViewProps {
  report: AnalysisReport;
  onReset: () => void;
  lang: Language;
  originalUrl: string;
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
    liveBrowserTitle: 'AI 실시간 스캔',
    verifiedLabel: '실시간 데이터 검증됨',
    posts: '게시물',
    followers: '팔로워',
    following: '팔로우',
    sentiment: { pos: '긍정', neu: '중립', neg: '부정' },
    sourcesLabel: '분석 근거 및 참고 자료'
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
    liveBrowserTitle: 'AI Live Scan',
    verifiedLabel: 'Data Verified',
    posts: 'Posts',
    followers: 'Followers',
    following: 'Following',
    sentiment: { pos: 'Pos', neu: 'Neu', neg: 'Neg' },
    sourcesLabel: 'Grounding Sources & References'
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
    verifiedLabel: '検証済み',
    posts: '投稿',
    followers: 'フォロワー',
    following: 'フォロー',
    sentiment: { pos: '肯定', neu: '中立', neg: '否定' },
    sourcesLabel: '分析の根拠と参照'
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
    <div className="w-full max-w-6xl mx-auto space-y-10 sm:space-y-16 animate-in fade-in duration-700 pb-12 sm:pb-24">
      {/* 라이브 브라우저 스캔 및 요약 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 px-4">
        {/* 브라우저 UI */}
        <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-indigo-100/40 flex flex-col h-full min-h-[380px] sm:min-h-[440px]">
            <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
              </div>
              <div className="flex-1 bg-white rounded-lg border border-slate-200 px-3 py-1 flex items-center gap-2 overflow-hidden shadow-inner">
                <i className="fa-solid fa-lock text-[9px] text-emerald-500"></i>
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 truncate tracking-tight uppercase">
                  {originalUrl}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center space-y-6 sm:space-y-10 bg-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/10 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-[scan_4s_ease-in-out_infinite]"></div>
              
              <div className="relative">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 border-slate-50 p-1 bg-white shadow-xl overflow-hidden relative z-10 group transition-transform hover:scale-105">
                  {report.profileHeader.imageUrl ? (
                    <img src={report.profileHeader.imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <i className="fa-solid fa-user text-2xl sm:text-4xl"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 border-white z-20 shadow-lg">
                  <i className="fa-solid fa-check text-[10px] sm:text-sm"></i>
                </div>
              </div>

              <div className="text-center space-y-1.5 relative z-10">
                <h3 className="text-xl sm:text-3xl font-[900] text-slate-900 tracking-tighter">{report.influencerName}</h3>
                <p className="text-[9px] sm:text-[11px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full inline-block">
                  {report.platformName} Live Verified
                </p>
              </div>

              <div className="w-full grid grid-cols-3 gap-2 border-y border-slate-100 py-6 sm:py-8 relative z-10">
                <div className="text-center">
                  <span className="block text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">{t.posts}</span>
                  <span className="text-base sm:text-2xl font-black text-slate-800 tabular-nums leading-none">{report.profileHeader.posts}</span>
                </div>
                <div className="text-center border-x border-slate-100">
                  <span className="block text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">{t.followers}</span>
                  <span className="text-base sm:text-2xl font-black text-indigo-600 tabular-nums leading-none">{report.profileHeader.followers}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">{t.following}</span>
                  <span className="text-base sm:text-2xl font-black text-slate-800 tabular-nums leading-none">{report.profileHeader.following}</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 relative z-10 shadow-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
                  <i className="fa-solid fa-microchip text-[10px] sm:text-sm"></i>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] sm:text-[12px] font-black text-white leading-tight">{t.verifiedLabel}</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 truncate mt-0.5">Real-time audit completed by AI Engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 요약 텍스트 및 점수 영역 */}
        <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex flex-col justify-center space-y-8 sm:space-y-12">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-[900] text-slate-900 tracking-tighter leading-[0.9] break-keep">{report.influencerName}</h1>
              <span className="px-4 py-1.5 sm:px-5 sm:py-2 bg-indigo-600 text-white text-[10px] sm:text-xs font-black rounded-full uppercase tracking-widest shadow-xl shadow-indigo-100/50">
                {report.niche}
              </span>
            </div>
            <p className="text-base sm:text-xl xl:text-2xl text-slate-500 leading-relaxed font-bold break-keep">
              {report.profileSummary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-10 p-6 sm:p-10 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 self-start w-full transition-all hover:shadow-2xl hover:shadow-indigo-50/50">
            <div className="space-y-1">
              <span className="block text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">{t.scoreLabel}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl sm:text-7xl font-black text-indigo-600 tracking-tighter leading-none">{report.score}</span>
                <span className="text-sm sm:text-lg font-black text-indigo-200">/ 100</span>
              </div>
            </div>
            <div className="hidden sm:block h-16 w-[2px] bg-slate-50 rounded-full"></div>
            <div className="h-[1px] w-full bg-slate-50 sm:hidden"></div>
            <div className="space-y-1">
              <span className="block text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">{t.percentilePrefix}</span>
              <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter leading-none">{percentile}{t.percentileSuffix}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 지표 그리드 */}
      <div className="px-4 space-y-6">
        <div className="flex justify-between items-end pb-3 border-b-2 border-slate-100/80">
          <div className="space-y-1">
            <h2 className="text-[10px] sm:text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.4)]"></span>
              CORE PERFORMANCE AUDIT
            </h2>
          </div>
          <button onClick={onReset} className="text-indigo-600 hover:text-indigo-800 text-[11px] sm:text-sm font-black flex items-center gap-2 transition-all hover:translate-x-1">
            <i className="fa-solid fa-rotate-right"></i> {t.resetButton}
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {report.metrics.map((m, idx) => (
            <MetricsCard key={idx} metric={m} />
          ))}
        </div>
      </div>

      {/* 심층 분석 섹션 (DNA & 감성) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 px-4">
        <div className="glass-card p-7 sm:p-10 rounded-[2rem] sm:rounded-[3rem] space-y-8 sm:space-y-12 shadow-sm">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 text-white rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-100">
              <i className="fa-solid fa-fingerprint text-xl sm:text-2xl"></i>
            </div>
            <h2 className="text-2xl sm:text-3xl font-[900] text-slate-900 tracking-tighter">{t.dnaHeader}</h2>
          </div>
          <div className="h-[220px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarData} layout="vertical" margin={{ left: -10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {(report.contentPillars || []).slice(0, 3).map((p, idx) => (
              <div key={idx} className="p-5 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-[1.5rem] border border-slate-100 transition-colors hover:bg-white hover:border-indigo-100 group">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h4 className="font-black text-slate-800 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">{p.topic}</h4>
                  <span className="text-[10px] sm:text-[12px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{p.weight}%</span>
                </div>
                <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed font-bold">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-7 sm:p-10 rounded-[2rem] sm:rounded-[3rem] space-y-8 sm:space-y-12 flex flex-col shadow-sm">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-500 text-white rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-pink-100">
              <i className="fa-solid fa-heart text-xl sm:text-2xl"></i>
            </div>
            <h2 className="text-2xl sm:text-3xl font-[900] text-slate-900 tracking-tighter">{t.sentimentHeader}</h2>
          </div>
          <div className="flex-1 min-h-[240px] sm:min-h-[300px] flex items-center justify-center">
            {/* Added missing ResponsiveContainer opening tag to match the closing tag on line 385 */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value">
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', border: 'none'}} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{paddingTop: '30px', fontSize: '11px', fontWeight: '900'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="p-6 sm:p-8 bg-indigo-50/50 rounded-[1.5rem] sm:rounded-[2rem] border border-indigo-100 italic text-slate-700 text-sm sm:text-lg leading-relaxed relative mt-2 font-bold break-keep">
            <i className="fa-solid fa-quote-left absolute -top-4 -left-2 text-indigo-200 text-4xl opacity-50"></i>
            "{report.sentiment?.summary}"
          </div>
        </div>
      </div>

      {/* 성장 전략 섹션 */}
      <div className="px-4">
        <div className="glass-card p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] space-y-10 sm:space-y-16 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-600 text-white rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-100">
              <i className="fa-solid fa-map text-2xl sm:text-4xl"></i>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-5xl font-[900] text-slate-900 tracking-tighter">{t.growthHeader}</h2>
              <p className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest">Data-Driven Evolution Roadmap</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
            {(report.growthStrategy || []).map((step, idx) => (
              <div key={idx} className="relative p-7 sm:p-10 bg-slate-50/50 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 transition-all hover:scale-[1.03] hover:bg-white hover:shadow-2xl group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-base sm:text-xl mb-6 sm:mb-8 group-hover:rotate-6 transition-transform">
                  {idx + 1}
                </div>
                <h4 className="font-[900] text-slate-900 text-lg sm:text-2xl mb-4 sm:mb-6 tracking-tight leading-tight">{step.title}</h4>
                <p className="text-[12px] sm:text-base text-slate-500 leading-relaxed font-bold break-keep">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 확장성 & 협업 가이드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 px-4">
        <div className="lg:col-span-2 glass-card p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] space-y-8 sm:space-y-12 shadow-sm">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500 text-white rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-amber-100">
              <i className="fa-solid fa-rocket-launch text-xl sm:text-3xl"></i>
            </div>
            <h2 className="text-2xl sm:text-4xl font-[900] text-slate-900 tracking-tighter">{t.futureHeader}</h2>
          </div>
          <div className="bg-slate-50 p-7 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 leading-relaxed text-slate-600 font-bold text-sm sm:text-xl break-keep">
            {report.scalabilityGuide}
          </div>
        </div>

        <div className="glass-card p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] space-y-8 sm:space-y-12 flex flex-col justify-between shadow-sm">
          <div className="space-y-8">
            <h3 className="text-xl sm:text-3xl font-[900] text-slate-900 flex items-center gap-3">
              <i className="fa-solid fa-briefcase text-indigo-600"></i>
              {t.collabHeader}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(report.brandAffinity || []).map((brand, idx) => (
                <span key={idx} className="px-3.5 py-1.5 sm:px-5 sm:py-2 bg-indigo-600 text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md">
                  {brand}
                </span>
              ))}
            </div>
            <ul className="space-y-5">
              {(report.recommendations || []).map((rec, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="mt-0.5 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black border border-emerald-100 shadow-sm">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <p className="text-slate-600 text-[12px] sm:text-base font-black leading-relaxed break-keep">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8 sm:pt-10 border-t border-slate-100">
            <button className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-2xl sm:rounded-[1.5rem] font-[900] text-[12px] sm:text-sm transition-all hover:bg-indigo-600 hover:scale-[1.02] shadow-2xl active:scale-95">
              전문가 상담 예약하기
            </button>
          </div>
        </div>
      </div>

      {/* Grounding Sources Section */}
      {report.sources && report.sources.length > 0 && (
        <div className="px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="p-8 bg-slate-100/50 rounded-[2rem] border border-slate-200">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-indigo-500"></i>
              {t.sourcesLabel}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-link text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{source.title}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{new URL(source.uri).hostname}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
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
