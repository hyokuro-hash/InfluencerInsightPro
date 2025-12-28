
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
        throw new Error("AI 결과 데이터를 해석할 수 없습니다.");
      }
    }
    throw e;
  }
};

export const analyzeInfluencer = async (url: string, lang: Language = 'ko'): Promise<AnalysisReport> => {
  // Use the API key from the environment variable directly.
  const key = process.env.API_KEY;
  
  if (!key) {
    throw new Error("환경 변수(process.env.API_KEY)가 설정되어 있지 않습니다. 설정 페이지에서 API_KEY를 등록해 주세요.");
  }

  const ai = new GoogleGenAI({ apiKey: key });
  const targetLanguage = getLanguageName(lang);
  
  const prompt = `Perform a deep analysis for the influencer at: ${url}. 
  Find real-time metrics for followers, posts, and engagement.
  All text must be in ${targetLanguage}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        systemInstruction: `You are a professional social media auditor. 
        Use real-time search to verify data. 
        Always return a structured JSON response.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const result = extractJson(response.text.trim()) as AnalysisReport;
    
    // Process search citations
    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "검증 데이터 출처",
            uri: chunk.web.uri
          });
        }
      });
    }
    
    result.sources = Array.from(new Set(groundingSources.map(s => s.uri)))
      .map(uri => groundingSources.find(s => s.uri === uri)!);

    return result;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // SDK specific error messages
    if (error.message?.includes("API Key")) {
      throw new Error("API 키가 유효하지 않거나 설정되지 않았습니다.");
    }
    throw new Error(error.message || "분석을 진행할 수 없습니다. 잠시 후 다시 시도해 주세요.");
  }
};

export const translateReport = async (sourceReport: AnalysisReport, targetLang: Language): Promise<AnalysisReport> => {
  const key = process.env.API_KEY;
  if (!key) return sourceReport;

  const ai = new GoogleGenAI({ apiKey: key });
  const targetLanguageName = getLanguageName(targetLang);

  const prompt = `Translate this report to ${targetLanguageName}: ${JSON.stringify(sourceReport)}`;

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
