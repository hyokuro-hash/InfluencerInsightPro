
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisReport, Language } from './types';
import { analyzeInfluencer, translateReport } from './services/geminiService';
import ReportView from './components/ReportView';

const translations: Record<Language, any> = {
  ko: {
    logo: { first: '인플루언서', second: '인사이트', third: 'PRO' },
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
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: '실시간 분석을 위해 API 키가 필요합니다',
      desc: '구글 검색 연동 기능을 사용하려면 유료 플랜이 활성화된 API 키 선택이 필요합니다.',
      button: 'API 키 선택하기',
      linkText: '결제 정보 설정 안내'
    }
  },
  en: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
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
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: 'API Key Required',
      desc: 'To use real-time search, please select an API key from a paid GCP project.',
      button: 'Select API Key',
      linkText: 'Billing Documentation'
    }
  },
  ja: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: 'ご利用ガイド', enterprise: 'エンタープライズ', login: 'ログイン' },
    hero: {
      title1: '인플루언서의 가치를',
      title2: '데이터로 증명하세요',
      sub: '단순 분석을 넘어, 성장을 위한 로드맵을 제시합니다. AI가 자동으로 플랫폼을 식별하고 딥다이브 리포트를 생성합니다.'
    },
    input: { placeholder: 'URLを入力してください', button: 'レポート作成' },
    loading: { title: 'データを精密分析中です...', sub: 'トレンドの関連성을 추출하고 있습니다. ' },
    translating: { title: '言語の最適화中...', sub: 'AI가 내용을 현지화하고 있습니다.' },
    features: [
      { title: '자동 플랫폼 식별', desc: '주소만으로 채널을 스스로 판별합니다.' },
      { title: '정밀 감성 분석', desc: '댓글 반응을 실시간 지수로 분류합니다.' },
      { title: '브랜드 협업 가이드', desc: '최적의 브랜드 적합성을 제안합니다.' },
      { title: '채널 성장 로드맵', desc: '도약을 위한 구체적 전략을 제공합니다.' },
      { title: '트렌드 확장성 분석', desc: '타 플랫폼 확장 가능성을 진단합니다.' },
      { title: '콘텐츠 DNA 추출', desc: '핵심 주제와 스타일을 정의합니다.' }
    ],
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: 'APIキーが必要です',
      desc: 'リアルタイム検索を使用するには、支払い情報が設定されたプロジェクトのAPIキーを選択してください。',
      button: 'APIキーを選択',
      linkText: '課金ドキュメント'
    }
  },
  zh: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: '使用指南', enterprise: '企业版', login: '登录' },
    hero: {
      title1: '用数据证明',
      title2: '网红의 价值',
      sub: '超越简单的分析，提供成长路线图。AI 自动生成深度分析报告。'
    },
    input: { placeholder: '输入 URL', button: '生成报告' },
    loading: { title: '正在分析数据...', sub: '正在提取增长指南和趋势相关性。' },
    translating: { title: '正在优化语言...', sub: 'AI 正在本地化内容。' },
    features: [
      { title: '自动平台识别', desc: '从 URL 自动识别平台。' },
      { title: '精准情感分析', desc: '实时分析粉丝评论情感。' },
      { title: '品牌合作指南', desc: '建议最匹配的品牌。' },
      { title: '增长路线图', desc: '提供具体的成长策略。' },
      { title: '趋势扩展分析', desc: '分析多平台扩展潜力。' },
      { title: '内容 DNA 提取', desc: '定义核心主题和风格。' }
    ],
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: '需要 API 密钥',
      desc: '要使用实时搜索，请选择一个已启用结算功能的项目的 API 密钥。',
      button: '选择 API 密钥',
      linkText: '结算说明文档'
    }
  },
  vi: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
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
      { title: 'Trích xuất DNA', desc: 'Xác định phong cách bằng dữ liệu.' }
    ],
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: 'Yêu cầu API Key',
      desc: 'Để sử dụng tìm kiếm thời gian thực, vui lòng chọn API Key từ một dự án đã thanh toán.',
      button: 'Chọn API Key',
      linkText: 'Tài liệu thanh toán'
    }
  },
  th: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: 'คู่มือ', enterprise: 'องค์กร', login: 'เข้าสู่ระบบ' },
    hero: {
      title1: 'พิสูจน์คุณค่าอินฟลูเอนเซอร์',
      title2: 'ด้วยข้อมูลเชิงลึก',
      sub: 'นำเสนอแผนงานเพื่อการเติบโต AI ระบุแพลตฟอร์มและสร้างรายงานเชิงลึกโดยอัตโนมัติ'
    },
    input: { placeholder: 'ป้อน URL', button: 'สร้างรายงาน' },
    loading: { title: 'กำลังวิเคราะห์ข้อมูล...', sub: 'กำลังดึงคู่มือการเติบโตและความเชื่อมโยงของเทรนด์' },
    translating: { title: 'กำลังปรับปรุงภาษา...', sub: 'AI กำลังปรับเนื้อหาให้เข้ากับท้องถิ่น' },
    features: [
      { title: 'ระบุแพลตฟอร์มอัตโนมัติ', desc: 'ระบุช่องจาก URL' },
      { title: 'วิเคราะห์ความรู้สึกแม่นยำ', desc: 'จำแนกการตอบสนองของคอมเมนต์เป็นดัชนีความรู้สึก' },
      { title: 'คู่มือความร่วมมือแบรนด์', desc: 'เสนอความเหมาะสมของแบรนด์ที่ดีที่สุด' },
      { title: 'แผนงานการเติบโต', desc: 'กลยุทธ์เพื่อยกระดับช่องของคุณให้สูงขึ้น' },
      { title: 'การวิเคราะห์การขยายเทรนด์', desc: 'วินิจฉัยศักยภาพในการขยายแพลตฟอร์ม' },
      { title: 'การสกัด DNA เนื้อหา', desc: 'กำหนดหัวข้อหลักและสไตล์' }
    ],
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: 'ต้องใช้ API Key',
      desc: 'เพื่อใช้การค้นหาแบบเรียลไทม์ โปรดเลือก API Key จากโปรเจกต์ที่มีการชำระเงิน',
      button: 'เลือก API Key',
      linkText: 'เอกสารการเรียกเก็บเงิน'
    }
  },
  id: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: 'Panduan', enterprise: 'Perusahaan', login: 'Masuk' },
    hero: {
      title1: 'Buktikan Nilai Influencer',
      title2: 'dengan Data Mendalam',
      sub: 'Menyediakan peta jalan pertumbuhan. AI secara otomatis mengidentifikasi platform dan menghasilkan laporan.'
    },
    input: { placeholder: 'Masukkan URL', button: 'Buat Laporan' },
    loading: { title: 'Menganalisis data...', sub: 'Mengekstrak panduan pertumbuhan dan tren.' },
    translating: { title: 'Mengoptimalkan bahasa...', sub: 'AI sedang melokalisasi konten.' },
    features: [
      { title: 'Deteksi Platform Otomatis', desc: 'Mengidentifikasi platform dari URL.' },
      { title: 'Analisis Sentimen Presisi', desc: 'Mengklasifikasikan respons komentar ke dalam indeks sentimen.' },
      { title: 'Panduan Kolaborasi Brand', desc: 'Menyarankan kesesuaian merek yang optimal.' },
      { title: 'Peta Jalan Pertumbuhan', desc: 'Strategi untuk meningkatkan level saluran Anda.' },
      { title: 'Analisis Skalabilitas Tren', desc: 'Mendiagnosis potensi ekspansi lintas platform.' },
      { title: 'Ekstraksi DNA Konten', desc: 'Mendefinisikan topik dan gaya inti.' }
    ],
    footer: '© 2024 Influencer Insight Pro.',
    apiKeyNeeded: {
      title: 'Memerlukan API Key',
      desc: 'Untuk menggunakan pencarian real-time, harap pilih API Key dari proyek berbayar.',
      button: 'Pilih API Key',
      linkText: 'Dokumentasi Penagihan'
    }
  }
};

const languages: { code: Language; label: string }[] = [
  { code: 'ko', label: '한국어(KR)' },
  { code: 'en', label: 'English(EN)' },
  { code: 'ja', label: '日本語(JP)' },
  { code: 'zh', label: '简体中文(CN)' },
  { code: 'vi', label: 'Tiếng Việt(VI)' },
  { code: 'th', label: 'ไทย(TH)' },
  { code: 'id', label: 'Bahasa Indonesia(ID)' },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ko');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [currentAnalyzedUrl, setCurrentAnalyzedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang] || translations.ko;

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          setHasKey(false);
        }
      } else {
        // Fallback for non-aistudio environments (not expected here)
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // guidelines: proceed assuming success to avoid race conditions
      setHasKey(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Double check key before analysis
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      if (!selected) {
        setHasKey(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setReport(null);
    setCurrentAnalyzedUrl(url);

    try {
      const data = await analyzeInfluencer(url, lang);
      setReport(data);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes("Requested entity was not found") || err.message.includes("API Key must be set")) {
        setHasKey(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLang: Language) => {
    setIsLangMenuOpen(false);
    if (newLang === lang) return;
    setLang(newLang);
    if (report) {
      setIsTranslating(true);
      try {
        const translated = await translateReport(report, newLang);
        setReport(translated);
      } catch (err: any) {
        console.error("Translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const reset = () => {
    setReport(null);
    setUrl('');
    setCurrentAnalyzedUrl('');
    setError(null);
  };

  const currentLangLabel = languages.find(l => l.code === lang)?.label || '한국어(KR)';

  // Initial Key Verification state
  if (hasKey === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="font-black text-slate-400 text-xs tracking-widest uppercase">Initializing Security...</p>
        </div>
      </div>
    );
  }

  // Key Selection Overlay
  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-12 text-center space-y-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto text-3xl animate-bounce">
            <i className="fa-solid fa-key"></i>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{t.apiKeyNeeded.title}</h2>
            <p className="text-slate-500 font-bold leading-relaxed">{t.apiKeyNeeded.desc}</p>
          </div>
          <div className="space-y-4 pt-4">
            <button 
              onClick={handleSelectKey}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              {t.apiKeyNeeded.button}
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-indigo-400 text-[11px] font-black underline hover:text-indigo-600"
            >
              {t.apiKeyNeeded.linkText}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0" onClick={reset}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-bolt-lightning text-xs sm:text-sm"></i>
            </div>
            <div className="flex items-baseline font-black text-sm sm:text-lg tracking-tighter">
              <span className="text-slate-900">{t.logo.first}</span>
              <span className="text-indigo-600 ml-0.5">{t.logo.second}</span>
              <span className="ml-1.5 animate-blink-gold font-black text-[10px] sm:text-[13px] tracking-widest">{t.logo.third}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto" ref={langMenuRef}>
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm hover:border-slate-300 transition-all active:scale-95 shrink-0"
              >
                <i className="fa-solid fa-earth-americas text-[#D4AF37] text-sm sm:text-base"></i>
                <span className="text-[10px] sm:text-[13px] font-black text-[#1e293b] leading-none">
                  {currentLangLabel}
                </span>
                <i className={`fa-solid fa-chevron-${isLangMenuOpen ? 'up' : 'down'} text-[8px] sm:text-[10px] text-slate-400 transition-transform duration-300`}></i>
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-[180px] sm:w-[220px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageChange(l.code)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors group"
                    >
                      <span className={`text-[12px] sm:text-[14px] font-black tracking-tight ${l.code === lang ? 'text-[#D4AF37]' : 'text-[#1e293b]'}`}>
                        {l.label}
                      </span>
                      {l.code === lang && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="px-3.5 py-1.5 sm:px-6 sm:py-2.5 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-black hover:bg-slate-800 transition-all shadow-md shrink-0">
              {t.nav.login}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        {!report && !isLoading && (
          <div className="space-y-16 sm:space-y-24">
            <div className="text-center space-y-8 sm:space-y-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-black border border-indigo-100 mb-2">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-indigo-600"></span>
                </span>
                AI Content Auditor v2.0
              </div>
              
              <h1 className="text-[clamp(1.75rem,9vw,5rem)] font-[900] text-slate-900 tracking-tighter leading-[1.05] break-keep px-2 sm:px-0">
                {t.hero.title1} <br />
                <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{t.hero.title2}</span>
              </h1>
              
              <p className="text-sm sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-bold px-4 opacity-80">
                {t.hero.sub}
              </p>

              <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto mt-10 sm:mt-16 px-2 group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-100">
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <i className="fa-solid fa-link text-indigo-300 text-sm"></i>
                    <input 
                      type="text" 
                      placeholder={t.input.placeholder}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-black text-sm sm:text-lg placeholder:text-slate-300 h-10 sm:h-14"
                    />
                  </div>
                  <button 
                    disabled={!url.trim()}
                    className="h-12 sm:h-14 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl sm:rounded-[2rem] font-black text-xs sm:text-sm transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    {t.input.button}
                  </button>
                </div>
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-2 duration-300 max-w-md mx-auto">
                    <p className="text-red-500 text-[11px] sm:text-xs font-black text-center leading-relaxed italic">{error}</p>
                  </div>
                )}
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-2">
              {t.features.map((f: any, i: number) => (
                <div key={i} className="group p-7 sm:p-10 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-6">
                    <i className={`fa-solid ${['fa-fingerprint', 'fa-heart-pulse', 'fa-handshake', 'fa-map-location-dot', 'fa-chart-pie', 'fa-dna'][i]} text-lg sm:text-xl`}></i>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-bold opacity-80">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-10">
            <div className="relative">
              <div className="w-16 h-16 sm:w-28 sm:h-28 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-microchip text-xl sm:text-4xl text-indigo-600 animate-pulse"></i>
              </div>
            </div>
            <div className="text-center space-y-3 px-6 max-w-sm sm:max-w-xl">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 leading-tight">{t.loading.title}</h2>
              <p className="text-slate-500 font-bold text-xs sm:text-lg opacity-80">{t.loading.sub}</p>
            </div>
          </div>
        )}

        {isTranslating && (
          <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-md flex items-center justify-center p-6">
             <div className="bg-white p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-6 max-w-xs sm:max-w-md w-full animate-in zoom-in duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <h3 className="font-black text-slate-900 text-sm sm:text-xl">{t.translating.title}</h3>
                  <p className="text-[10px] sm:text-sm text-slate-400 font-bold mt-2">{t.translating.sub}</p>
                </div>
             </div>
          </div>
        )}

        {report && !isLoading && (
          <ReportView report={report} onReset={reset} lang={lang} originalUrl={currentAnalyzedUrl} />
        )}
      </main>

      <footer className="py-12 sm:py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
              <i className="fa-solid fa-bolt-lightning text-xs"></i>
            </div>
            <div className="flex items-baseline font-black text-xs tracking-widest text-slate-400">
              <span>INFLUENCER INSIGHT</span>
              <span className="ml-1 animate-blink-gold">PRO</span>
            </div>
          </div>
          <p className="text-slate-300 text-[10px] sm:text-xs font-black uppercase tracking-widest text-center">{t.footer}</p>
          <div className="flex gap-10 text-slate-300">
            <i className="fa-brands fa-instagram text-2xl hover:text-indigo-600 cursor-pointer transition-all hover:scale-125"></i>
            <i className="fa-brands fa-youtube text-2xl hover:text-indigo-600 cursor-pointer transition-all hover:scale-125"></i>
            <i className="fa-brands fa-x-twitter text-2xl hover:text-indigo-600 cursor-pointer transition-all hover:scale-125"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
