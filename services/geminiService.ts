
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, Language, GroundingSource } from "../types";

// 리포트 생성을 위한 JSON 스키마
const reportSchema = {
  type: Type.OBJECT,
  properties: {
    influencerName: { type: Type.STRING },
    platformName: { type: Type.STRING },
    niche: { type: Type.STRING },
    profileSummary: { type: Type.STRING },
    profileHeader: {
      type: Type.OBJECT,
      properties: {
        posts: { type: Type.STRING },
        followers: { type: Type.STRING },
        following: { type: Type.STRING },
        imageUrl: { type: Type.STRING }
      },
      required: ["posts", "followers", "following"]
    },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
          trend: { type: Type.STRING, enum: ['up', 'down', 'neutral'] },
          percentage: { type: Type.STRING }
        },
        required: ["label", "value", "trend"]
      }
    },
    contentPillars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          weight: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ["topic", "weight", "description"]
      }
    },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        positive: { type: Type.NUMBER },
        neutral: { type: Type.NUMBER },
        negative: { type: Type.NUMBER },
        summary: { type: Type.STRING }
      },
      required: ["positive", "neutral", "negative", "summary"]
    },
    brandAffinity: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    growthStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    scalabilityGuide: { type: Type.STRING },
    score: { type: Type.NUMBER }
  },
  required: [
    "influencerName", 
    "platformName", 
    "niche", 
    "profileSummary",
    "profileHeader",
    "metrics", 
    "contentPillars",
    "sentiment",
    "brandAffinity",
    "recommendations",
    "growthStrategy",
    "scalabilityGuide",
    "score"
  ]
};

const getLanguageName = (lang: Language) => {
  const map: Record<Language, string> = {
    ko: 'Korean (한국어)',
    en: 'English',
    ja: 'Japanese (日本語)',
    zh: 'Chinese Simplified (简体中文)',
    vi: 'Vietnamese (Tiếng Việt)',
    th: 'Thai (ภาษาไทย)',
    id: 'Indonesian (Bahasa Indonesia)',
  };
  return map[lang] || map.ko;
};

const extractJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        throw new Error("AI가 생성한 데이터 형식이 올바르지 않습니다.");
      }
    }
    throw e;
  }
};

export const analyzeInfluencer = async (url: string, lang: Language = 'ko'): Promise<AnalysisReport> => {
  // process.env.API_KEY 유무를 엄격하게 확인
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("시스템에 API 키가 설정되지 않았습니다. 관리자 설정에서 API_KEY를 확인해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguage = getLanguageName(lang);
  
  const prompt = `인플루언서 프로필 분석 요청: ${url}
  
  1. 제공된 URL을 검색하여 현재 팔로워, 게시물 수, 최근 활동을 확인하세요.
  2. 인플루언서의 주요 콘텐츠 주제와 오디언스 반응(긍정/부정)을 분석하세요.
  3. 향후 성장 전략과 어울리는 브랜드 카테고리를 제안하세요.
  
  결과는 반드시 ${targetLanguage}로 작성된 JSON 형식이어야 합니다.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        systemInstruction: `당신은 전문적인 인플루언서 분석가입니다. 
        Google 검색 기능을 사용하여 제공된 URL의 실시간 데이터를 수집하고 분석하세요.
        반드시 지정된 JSON 스키마를 준수하여 응답하세요.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const result = extractJson(response.text.trim()) as AnalysisReport;
    
    // 출처 정보 추출 (Grounding Metadata)
    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "참고 자료",
            uri: chunk.web.uri
          });
        }
      });
    }
    
    const uniqueSources = Array.from(new Set(groundingSources.map(s => s.uri)))
      .map(uri => groundingSources.find(s => s.uri === uri)!);

    result.sources = uniqueSources;
    return result;
  } catch (error: any) {
    console.error("Analysis Error Details:", error);
    // API 키 관련 에러인 경우 사용자 친화적인 메시지로 변환
    if (error.message?.includes("API Key") || error.message?.includes("browser")) {
      throw new Error("제공된 API 키를 브라우저에서 사용할 수 없습니다. 환경 변수 설정을 다시 한번 확인해주세요.");
    }
    throw new Error(error.message || "분석을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
};

export const translateReport = async (sourceReport: AnalysisReport, targetLang: Language): Promise<AnalysisReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return sourceReport;

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguageName = getLanguageName(targetLang);

  const prompt = `다음 리포트 내용을 ${targetLanguageName}로 번역하세요. 숫치와 핵심 데이터는 유지하세요: ${JSON.stringify(sourceReport)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });
    const result = extractJson(response.text.trim()) as AnalysisReport;
    result.sources = sourceReport.sources;
    return result;
  } catch (error) {
    return sourceReport;
  }
};
