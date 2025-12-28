
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, Language, GroundingSource } from "../types";

const API_KEY = process.env.API_KEY || "";

// 공통 스키마 정의
const reportSchema = {
  type: Type.OBJECT,
  properties: {
    influencerName: { type: Type.STRING },
    platformName: { type: Type.STRING },
    niche: { type: Type.STRING },
    profileSummary: { type: Type.STRING },
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
    brandAffinity: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
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
  switch (lang) {
    case 'ko': return 'Korean (한국어)';
    case 'ja': return 'Japanese (日本語)';
    case 'zh': return 'Chinese Simplified (简体中文)';
    case 'vi': return 'Vietnamese (Tiếng Việt)';
    default: return 'English';
  }
};

export const analyzeInfluencer = async (url: string, lang: Language = 'ko'): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const targetLanguage = getLanguageName(lang);
  
  const prompt = `Analyze the influencer profile at this URL: ${url}. 
  The entire report and ALL text values within the JSON must be written in ${targetLanguage}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a world-class influencer brand strategist. Generate a deep-dive report in ${targetLanguage}.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const result = JSON.parse(response.text.trim()) as AnalysisReport;

    // Extract sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }
    result.sources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return result;
  } catch (error) {
    const errorMessages = {
      ko: "분석 중 오류가 발생했습니다.",
      ja: "分析中にエラーが発生しました。",
      zh: "分析过程中出错。",
      vi: "Đã xảy ra lỗi trong quá trình phân tích.",
      en: "Error during analysis."
    };
    throw new Error(errorMessages[lang] || errorMessages.en);
  }
};

export const translateReport = async (sourceReport: AnalysisReport, targetLang: Language): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const targetLanguageName = getLanguageName(targetLang);

  const prompt = `
    Translate the following influencer analysis report into ${targetLanguageName}.
    
    CRITICAL RULES:
    1. Keep all numeric values (scores, weights, percentages, sentiment numbers) EXACTLY the same.
    2. Translate all descriptive text, labels, summaries, and strategies into natural, professional ${targetLanguageName}.
    3. Maintain the professional tone of a brand strategist.
    4. Ensure the output is a valid JSON matching the original structure.

    SOURCE REPORT:
    ${JSON.stringify(sourceReport)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const translatedResult = JSON.parse(response.text.trim()) as AnalysisReport;
    translatedResult.sources = sourceReport.sources;
    
    return translatedResult;
  } catch (error) {
    const errorMessages = {
      ko: "리포트 번역 중 오류가 발생했습니다.",
      ja: "レポートの翻訳中にエラーが発生しました。",
      zh: "报告翻译过程中出错。",
      vi: "Đã xảy ra lỗi khi dịch báo cáo.",
      en: "Error translating the report."
    };
    throw new Error(errorMessages[targetLang] || errorMessages.en);
  }
};
