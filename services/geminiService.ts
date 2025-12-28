
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, Language, GroundingSource } from "../types";

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
  // Ensure we use the latest environment variable
  const apiKey = process.env.API_KEY || '';
  
  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다. 관리자 설정에서 API_KEY 환경 변수를 확인해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguage = getLanguageName(lang);
  
  const prompt = `Perform a deep performance analysis of the following influencer profile: ${url}. 
  Find live data about their posts count, followers, engagement, and audience sentiment. 
  The analysis must be in ${targetLanguage}. 
  Ensure all numbers are accurately fetched using search.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        systemInstruction: `You are a world-class social media auditor. 
        Fetch real-time metrics using Google Search Grounding. 
        Return a strict JSON response following the provided schema.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const result = extractJson(response.text.trim()) as AnalysisReport;
    
    // Extract search references
    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "Reference",
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
    console.error("Gemini SDK Error:", error);
    if (error.message?.includes("API Key") || error.message?.includes("browser")) {
      throw new Error("브라우저 환경에서 API 키가 올바르게 주입되지 않았습니다. 환경 설정을 점검해 주세요.");
    }
    throw new Error(error.message || "분석 서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
  }
};

export const translateReport = async (sourceReport: AnalysisReport, targetLang: Language): Promise<AnalysisReport> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) return sourceReport;

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguageName = getLanguageName(targetLang);

  const prompt = `Translate this influencer report to ${targetLanguageName}. Keep all metrics and specific values as they are: ${JSON.stringify(sourceReport)}`;

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
