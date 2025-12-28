
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisReport, Language } from './types';
import { analyzeInfluencer, translateReport } from './services/geminiService';
import ReportView from './components/ReportView';

const translations = {
  ko: {
    logo: { first: '인플루언서', second: '인사이트', third: '프로' },
    nav: { usage: '이용 안내', enterprise: '엔터프라이즈', login: '로그인' },
    hero: {
      title1: '인플루언서의 가치를',
      title2: '데이터로 증명하세요',
      sub: '단순 분석을 넘어, 성장을 위한 로드맵을 제시합니다. AI가 자동으로 플랫폼을 식별하고 딥다이브 리포트를 생성합니다.'
    },
    input: { placeholder: 'URL을 입력하세요', button: '리포트 생성' },
    loading: { title: '데이터를 정밀 분석 중입니다...', sub: '성장 가이드와 트렌드 연관성을 추출하고 있습니다.' },
    translating: { title: '리포트 언어 최적화 중...', sub: 'AI가 내용을 현지화하고 있습니다.' },
    features: [
      { title: '자동 플랫폼 식별', desc: '주소만으로 채널을 스스로 판별합니다.' },
      { title: '정밀 감성 분석', desc: '댓글 반응을 실시간 지수로 분류합니다.' },
      { title: '브랜드 협업 가이드', desc: '최적의 브랜드 적합성을 제안합니다.' },
      { title: '채널 성장 로드맵', desc: '도약을 위한 구체적 전략을 제공합니다.' },
      { title: '트렌드 확장성 분석', desc: '타 플랫폼 확장 가능성을 진단합니다.' },
      { title: '콘텐츠 DNA 추출', desc: '핵심 주제와 스타일을 정의합니다.' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
  },
  en: {
    logo: { first: 'Influencer', second: 'Insight', third: 'Pro' },
    nav: { usage: 'Guide', enterprise: 'Enterprise', login: 'Login' },
    hero: {
      title1: 'Prove Influencer Value',
      title2: 'with Deep Data',
      sub: 'Going beyond simple analysis, we provide growth roadmaps. AI identifies platforms automatically and generates reports.'
    },
    input: { placeholder: 'Enter URL', button: 'Generate' },
    loading: { title: 'Analyzing data...', sub: 'Extracting growth guides and trend associations.' },
    translating: { title: 'Optimizing language...', sub: 'AI is localizing the content.' },
    features: [
      { title: 'Auto Platform Detection', desc: 'Identifies platforms from the URL.' },
      { title: 'Sentiment Analysis', desc: 'Classifies comments into sentiment indices.' },
      { title: 'Brand Collab Guide', desc: 'Suggests optimal brand fit.' },
      { title: 'Growth Roadmap', desc: 'Strategies to take your channel higher.' },
      { title: 'Trend Scalability', desc: 'Diagnoses expansion potential.' },
      { title: 'Content DNA Extraction', desc: 'Defines core topics and styles.' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
  },
  ja: {
    logo: { first: 'Influencer', second: 'Insight', third: 'Pro' },
    nav: { usage: 'ご利用ガイド', enterprise: 'エン터프라이즈', login: 'ログイン' },
    hero: {
      title1: 'インフルエンサーの価値を',
      title2: 'データで証明しましょう',
      sub: '成長のためのロードマップを提示します。AIが自動的にレポートを生成します。'
    },
    input: { placeholder: 'URLを入力してください', button: 'レポート作成' },
    loading: { title: 'データを精密分析中です...', sub: 'トレンドの関連性까지 抽出しています。' },
    translating: { title: '言語を最適化しています...', sub: '内容をローカライズしています。' },
    features: [
      { title: '自動識別', desc: 'URLだけでプラットフォームを判別します。' },
      { title: '感情分析', desc: 'オーディエンスの反応を指数化します。' },
      { title: 'タイアップガイド', desc: '最適なブランド適合性を提案します。' },
      { title: '成長ロードマップ', desc: '具体的な成長戦略を提供します。' },
      { title: 'トレンド分析', desc: '拡張可能性を診断します。' },
      { title: 'DNA抽出', desc: 'スタイルを데이터で定義します。' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
  },
  zh: {
    logo: { first: 'Influencer', second: 'Insight', third: 'Pro' },
    nav: { usage: '指南', enterprise: '企业版', login: '登录' },
    hero: {
      title1: '用数据证明',
      title2: '网红的价值',
      sub: '超越简单的分析，提供成长路线图。AI 自动生成深度分析报告。'
    },
    input: { placeholder: '请输入 URL', button: '生成报告' },
    loading: { title: '正在进行精确分析...', sub: '正在提取成长指南和趋势关联。' },
    translating: { title: '正在优化语言...', sub: 'AI 正在对内容进行本地化。' },
    features: [
      { title: '自动平台识别', desc: '仅凭 URL 即可识别。' },
      { title: '情感分析', desc: '将受众反应分类为情感指数。' },
      { title: '品牌合作指南', desc: '建议最佳合作匹配度。' },
      { title: '成长路线图', desc: '助您的频道更上一层楼。' },
      { title: '扩展性分析', desc: '诊断跨平台扩展的潜力。' },
      { title: '内容 DNA 提取', desc: '定义频道核心主题。' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
  },
  vi: {
    logo: { first: 'Influencer', second: 'Insight', third: 'Pro' },
    nav: { usage: 'Hướng dẫn', enterprise: 'Doanh nghiệp', login: 'Đăng nhập' },
    hero: {
      title1: 'Chứng minh giá trị',
      title2: 'bằng dữ liệu',
      sub: 'Cung cấp lộ trình tăng trưởng. AI tự động nhận diện nền tảng và tạo báo cáo.'
    },
    input: { placeholder: 'Nhập URL', button: 'Tạo báo cáo' },
    loading: { title: 'Đang phân tích dữ liệu...', sub: 'Đang trích xuất hướng dẫn tăng trưởng.' },
    translating: { title: 'Đang tối ưu ngôn ngữ...', sub: 'AI đang bản địa hóa nội dung.' },
    features: [
      { title: 'Tự động nhận diện', desc: 'Xác định nền tảng bằng URL.' },
      { title: 'Phân tích cảm xúc', desc: 'Phân loại cảm xúc khán giả.' },
      { title: 'Hướng dẫn hợp tác', desc: 'Đề xuất mức độ phù hợp.' },
      { title: 'Lộ trình phát triển', desc: 'Chiến lược đưa kênh lên tầm cao mới.' },
      { title: 'Phân tích xu hướng', desc: 'Chẩn đoán tiềm năng mở rộng.' },
      { title: 'Trích xuất DNA', desc: 'Xác định chủ đề cốt lõi.' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ko');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [reports, setReports] = useState<Partial<Record<Language, AnalysisReport>>>({});
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];
  const currentReport = reports[lang];
  const reportsRef = useRef(reports);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  reportsRef.current = reports;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const availableLangs = Object.keys(reportsRef.current) as Language[];
    if (availableLangs.length > 0 && !reportsRef.current[lang] && !isTranslating) {
      const sourceLang = availableLangs[0];
      const sourceReport = reportsRef.current[sourceLang]!;
      handleTranslate(sourceReport, lang);
    }
  }, [lang]);

  const handleTranslate = async (source: AnalysisReport, target: Language) => {
    setIsTranslating(true);
    setError(null);
    try {
      const result = await translateReport(source, target);
      setReports(prev => ({ ...prev, [target]: result }));
    } catch (err: any) {
      setError(err.message || 'Error during translation.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setReports({});

    try {
      const result = await analyzeInfluencer(url, lang);
      setReports({ [lang]: result });
    } catch (err: any) {
      setError(err.message || 'Error during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setReports({});
    setUrl('');
    setError(null);
  };

  const getLangDisplayName = (l: Language) => {
    const names = { ko: '한국어', en: 'English', ja: '日本語', zh: '简体中文', vi: 'Tiếng Việt' };
    return names[l];
  };

  const hasAnyReport = Object.keys(reports).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 sm:py-12 px-4">
      {/* 내비게이션 */}
      <nav className="w-full max-w-6xl mb-8 sm:mb-16 flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0" onClick={reset}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-magnifying-glass-chart text-xs sm:text-xl"></i>
          </div>
          <span className="text-[13px] sm:text-xl font-bold tracking-tight text-slate-800 whitespace-nowrap">
            {t.logo.first} <span className="text-indigo-600">{t.logo.second}</span> {t.logo.third}
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="relative" ref={langDropdownRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-[10px] sm:text-sm font-bold text-slate-600 hover:text-[#D4AF37] border px-2 sm:px-3 py-1.5 rounded-lg bg-white shadow-sm transition-all hover:border-[#D4AF37] group"
            >
              <i className="fa-solid fa-globe group-hover:text-[#D4AF37]"></i>
              <span className="hidden xs:inline">{getLangDisplayName(lang)}</span>
              <span className="xs:hidden">{lang.toUpperCase()}</span>
              <i className={`fa-solid fa-chevron-down text-[8px] sm:text-[10px] transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}></i>
            </button>
            
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {(['ko', 'en', 'ja', 'zh', 'vi'] as Language[]).map((l) => (
                  <button 
                    key={l}
                    onClick={() => { setLang(l); setIsLangOpen(false); }} 
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${lang === l ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600'}`}
                  >
                    {getLangDisplayName(l)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="hidden sm:inline-flex px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-md hover:bg-slate-800 transition-all">
            {t.nav.login}
          </button>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center">
        {!hasAnyReport ? (
          <div className="w-full max-w-5xl flex flex-col items-center text-center space-y-8 sm:space-y-12 animate-in slide-in-from-bottom duration-700">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 leading-[1.2] tracking-tight px-2">
                {t.hero.title1} <br />
                <span className="gradient-text">{t.hero.title2}</span>
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed px-4">
                {t.hero.sub}
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="w-full max-w-3xl glass-card p-2 sm:p-4 rounded-3xl md:rounded-[2.5rem] flex flex-col sm:flex-row gap-2 shadow-2xl shadow-indigo-100/50 mx-4">
              <div className="flex-1 flex items-center px-4 sm:px-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100">
                <i className="fa-solid fa-link text-slate-400 mr-2 sm:mr-3 text-sm"></i>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t.input.placeholder}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-semibold"
                  required
                />
              </div>
              
              <button 
                disabled={isAnalyzing}
                type="submit"
                className="px-6 sm:px-10 py-3 sm:py-4 bg-indigo-600 text-white rounded-2xl sm:rounded-3xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 text-sm sm:text-base"
              >
                {isAnalyzing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : t.input.button}
              </button>
            </form>

            {isAnalyzing && (
              <div className="flex flex-col items-center gap-4 sm:gap-6 animate-pulse px-4">
                <div className="text-center">
                  <p className="text-slate-700 font-bold text-base sm:text-lg">{t.loading.title}</p>
                  <p className="text-slate-400 text-xs sm:text-sm">{t.loading.sub}</p>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-slate-200 rounded-full max-w-xs overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-600 w-1/2 animate-[progress_2s_infinite] rounded-full"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-4 p-3 px-5 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold shadow-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 pt-6 sm:pt-12 px-2">
              {t.features.map((feature, i) => {
                const styles = [
                  { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'fa-wand-magic-sparkles' },
                  { color: 'text-pink-600', bg: 'bg-pink-50', icon: 'fa-users' },
                  { color: 'text-amber-600', bg: 'bg-amber-50', icon: 'fa-bolt' },
                  { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'fa-rocket' },
                  { color: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-chart-line' },
                  { color: 'text-purple-600', bg: 'bg-purple-50', icon: 'fa-dna' }
                ];
                const style = styles[i % styles.length];
                return (
                  <div key={i} className="flex flex-col items-center gap-3 sm:gap-4 group">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 ${style.bg} rounded-xl sm:rounded-2xl flex items-center justify-center ${style.color} shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}>
                      <i className={`fa-solid ${style.icon} text-base sm:text-xl`}></i>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-bold text-slate-800 text-xs sm:text-base leading-tight">{feature.title}</h3>
                      <p className="hidden xs:block text-[10px] sm:text-sm text-slate-400 leading-relaxed max-w-[180px] mx-auto font-medium">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full relative px-2 sm:px-4">
            {isTranslating && (
              <div className="fixed inset-0 z-50 bg-slate-50/60 backdrop-blur-sm flex items-center justify-center">
                 <div className="glass-card p-8 rounded-3xl shadow-2xl border-indigo-100 flex flex-col items-center text-center animate-pulse">
                    <p className="text-indigo-600 font-bold text-lg sm:text-xl mb-2">{t.translating.title}</p>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium">{t.translating.sub}</p>
                    <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-indigo-600 w-1/3 animate-[progress_1.5s_infinite] rounded-full"></div>
                    </div>
                  </div>
              </div>
            )}
            {currentReport && <ReportView report={currentReport} onReset={reset} lang={lang} />}
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-slate-400 text-[10px] sm:text-xs font-semibold flex flex-col items-center gap-1">
        <p>{t.footer}</p>
      </footer>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default App;
