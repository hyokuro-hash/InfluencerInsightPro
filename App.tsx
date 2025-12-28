
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisReport, Language } from './types';
import { analyzeInfluencer, translateReport } from './services/geminiService';
import ReportView from './components/ReportView';

const translations = {
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
    footer: '© 2024 Influencer Insight Pro.'
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
    footer: '© 2024 Influencer Insight Pro.'
  },
  ja: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: 'ご利用ガイド', enterprise: 'エンタープライズ', login: 'ログイン' },
    hero: {
      title1: 'インフルエンサーの価値을',
      title2: 'データで証明しましょう',
      sub: '単なる分析を超えて、成長のためのロードマップを提示します。AIが自動的にレポートを生成します。'
    },
    input: { placeholder: 'URLを入力してください', button: 'レポート作成' },
    loading: { title: 'データを精密分析中です...', sub: 'トレンドの関連性を抽出しています。' },
    translating: { title: '言語の最適化中...', sub: 'AIが内容をローカライズしています。' },
    features: [
      { title: '自動プラットフォーム識別', desc: 'URLだけでチャンネルを識別します.' },
      { title: '精密感情分析', desc: 'コメントの反応をリアルタイム指数で分類します.' },
      { title: 'ブランドコラボガイド', desc: '最適なブランド適合性を提案します' },
      { title: 'チャンネル成長ロードマップ', desc: '飛躍のための具体的な戦略を提供します.' },
      { title: 'トレンド拡張性分析', desc: '他プラットフォームへの拡張可能性を診断します.' },
      { title: 'コンテンツDNA抽出', desc: '核心テーマとスタイルを定義します.' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
  },
  zh: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: '指南', enterprise: '企业版', login: '登录' },
    hero: {
      title1: '用数据证明',
      title2: '网红의 가치',
      sub: '超越简单的分析，提供成长路线图。AI 自动生成深度分析报告。'
    },
    input: { placeholder: '请输入 URL', button: '生成报告' },
    loading: { title: '正在进行精确分析...', sub: '正在提取成长指南和趋势关联。' },
    translating: { title: '正在优化语言...', sub: 'AI 正在对内容进行本地化。' },
    features: [
      { title: '自动平台识别', desc: '仅凭 URL 即可识别平台.' },
      { title: '情感分析', desc: '将受众反应分类为情感指数.' },
      { title: '品牌合作指南', desc: '建议最佳合作匹配度.' },
      { title: '成长路线图', desc: '助您的频道更上一层楼.' },
      { title: '扩展性分析', desc: '诊断跨平台扩展的潜力.' },
      { title: '内容 DNA 提取', desc: '定义频道核心主题.' }
    ],
    footer: '© 2024 Influencer Insight Pro.'
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
    footer: '© 2024 Influencer Insight Pro.'
  },
  th: {
    logo: { first: 'Influencer', second: 'Insight', third: 'PRO' },
    nav: { usage: 'คู่มือ', enterprise: 'องค์กร', login: 'เข้าสู่ระบบ' },
    hero: {
      title1: 'พิสูจน์คุณค่าอิน플ลูเอนเซอร์',
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
    footer: '© 2024 Influencer Insight Pro.'
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
    footer: '© 2024 Influencer Insight Pro.'
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ko');
  const [url, setUrl] = useState('');
  const [currentAnalyzedUrl, setCurrentAnalyzedUrl] = useState(''); // 분석에 사용된 원본 URL 저장
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang] || translations.ko;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setReport(null);
    setCurrentAnalyzedUrl(url); // 분석 시작 시점의 URL 저장

    try {
      const data = await analyzeInfluencer(url, lang);
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLang: Language) => {
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-bolt-lightning text-sm"></i>
            </div>
            <div className="flex font-black text-lg tracking-tighter">
              <span className="text-slate-900">{t.logo.first}</span>
              <span className="text-indigo-600">{t.logo.second}</span>
              <span className="text-slate-300 ml-1">{t.logo.third}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">{t.nav.usage}</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">{t.nav.enterprise}</a>
            </div>
            
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm hover:border-indigo-200 transition-all group">
              <i className="fa-solid fa-earth-americas text-amber-500 text-xs mr-2"></i>
              <select 
                value={lang} 
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent border-none p-0 text-[11px] font-bold text-slate-700 cursor-pointer focus:ring-0 outline-none appearance-none pr-4"
              >
                <option value="ko">한국어(KR)</option>
                <option value="en">영어(EN)</option>
                <option value="ja">일본어(JP)</option>
                <option value="zh">중국어(CN)</option>
                <option value="vi">베트남어(VN)</option>
                <option value="th">태국어(TH)</option>
                <option value="id">인도네시아어(ID)</option>
              </select>
              <i className="fa-solid fa-chevron-down text-[8px] text-slate-400 absolute right-3 pointer-events-none transition-transform group-hover:translate-y-0.5"></i>
            </div>

            <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-md">
              {t.nav.login}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        {!report && !isLoading && (
          <div className="space-y-16 sm:space-y-24">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Powered by Gemini 3.0 Pro (Data Grounding)
              </div>
              <h1 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {t.hero.title1} <br />
                <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{t.hero.title2}</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                {t.hero.sub}
              </p>

              <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto mt-8 sm:mt-12 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100">
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <i className="fa-solid fa-link text-slate-300"></i>
                    <input 
                      type="text" 
                      placeholder={t.input.placeholder}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-medium placeholder:text-slate-300 h-12"
                    />
                  </div>
                  <button 
                    disabled={!url.trim()}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl sm:rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
                  >
                    {t.input.button}
                  </button>
                </div>
                {error && <p className="mt-4 text-red-500 text-sm font-bold animate-bounce">{error}</p>}
              </form>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {t.features.map((f, i) => (
                <div key={i} className="group p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-6">
                    <i className={`fa-solid ${['fa-fingerprint', 'fa-heart-pulse', 'fa-handshake', 'fa-map-location-dot', 'fa-chart-pie', 'fa-dna'][i]} text-xl`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-bolt-lightning text-2xl sm:text-3xl text-indigo-600 animate-bounce"></i>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-xl sm:text-3xl font-black text-slate-900">{t.loading.title}</h2>
              <p className="text-slate-500 font-bold text-sm sm:text-base">{t.loading.sub}</p>
            </div>
          </div>
        )}

        {isTranslating && (
          <div className="fixed inset-0 z-[60] bg-white/60 backdrop-blur-sm flex items-center justify-center">
             <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <h3 className="font-black text-slate-900">{t.translating.title}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">{t.translating.sub}</p>
                </div>
             </div>
          </div>
        )}

        {report && !isLoading && (
          <ReportView report={report} onReset={reset} lang={lang} originalUrl={currentAnalyzedUrl} />
        )}
      </main>

      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center text-white">
              <i className="fa-solid fa-bolt-lightning text-[10px]"></i>
            </div>
            <span className="text-sm font-black text-slate-300 tracking-tighter">INFLUENCER INSIGHT PRO</span>
          </div>
          <p className="text-slate-400 text-xs font-bold">{t.footer}</p>
          <div className="flex gap-6 text-slate-300">
            <i className="fa-brands fa-instagram hover:text-indigo-600 cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-youtube hover:text-indigo-600 cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-x-twitter hover:text-indigo-600 cursor-pointer transition-colors"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
