
// @google/genai guidelines: Use direct process.env.API_KEY reference
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, Language, GroundingSource } from "../types";

// 공통 스키마 정의
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
  switch (lang) {
    case 'ko': return 'Korean (한국어)';
    case 'ja': return 'Japanese (日本語)';
    case 'zh': return 'Chinese Simplified (简体中文)';
    case 'vi': return 'Vietnamese (Tiếng Việt)';
    case 'th': return 'Thai (ภาษาไทย)';
    case 'id': return 'Indonesian (Bahasa Indonesia)';
    default: return 'English';
  }
};

// Robust JSON extraction
const extractJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        throw new Error("Invalid JSON format from AI");
      }
    }
    throw e;
  }
};

export const analyzeInfluencer = async (url: string, lang: Language = 'ko'): Promise<AnalysisReport> => {
  // CRITICAL: Always create a new instance right before calling
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetLanguage = getLanguageName(lang);
  
  const prompt = `Perform an ULTRA-PRECISION REAL-TIME audit of the influencer profile at: ${url}.

CORE MISSION:
Extract the EXACT visual data shown in the profile header.
1. "Posts" count
2. "Followers" count
3. "Following" count

STRICT DATA VERIFICATION STEPS:
1. Use Google Search to find current stats.
2. Provide the data as raw strings seen on the platform.
3. Calculate Engagement Rate and provide detailed metrics.

LANGUAGE: ${targetLanguage}.
Return a valid JSON object matching the requested schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Using pro-image model for best grounding/search
      contents: prompt,
      config: {
        systemInstruction: `You are a precision SNS auditor. 
        Extract raw data (followers, posts) from the live URL. 
        Always return a structured JSON response.
        Use Google Search to verify the most recent figures.`,
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are NOT supported for gemini-3-pro-image-preview
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });

    const result = extractJson(response.text.trim()) as AnalysisReport;
    
    // Extract Grounding Sources
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
    
    // Remove duplicates
    const uniqueSources = Array.from(new Set(groundingSources.map(s => s.uri)))
      .map(uri => groundingSources.find(s => s.uri === uri)!);

    result.sources = uniqueSources;
    return result;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("Requested entity was not found. Please re-select your API key.");
    }

    const errorMessages = {
      ko: "실시간 데이터 분석 중 오류가 발생했습니다. URL이 정확한지 확인해 주세요.",
      ja: "リアルタイム分析중에 오류가 발생했습니다.",
      zh: "实时分析过程中出错。",
      vi: "Đã xảy ra lỗi trong quá trình phân tích.",
      th: "เกิดข้อผิดพลาดระหว่างการวิเคราะห์",
      id: "Terjadi kesalahan selama analisis.",
      en: "Error during real-time analysis."
    };
    throw new Error(errorMessages[lang] || errorMessages.en);
  }
};

export const translateReport = async (sourceReport: AnalysisReport, targetLang: Language): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetLanguageName = getLanguageName(targetLang);

  const prompt = `Translate the following influencer report to ${targetLanguageName}. Keep all numbers, metrics, and technical data EXACTLY as they are. Return only JSON. ${JSON.stringify(sourceReport)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });
    const result = extractJson(response.text.trim()) as AnalysisReport;
    result.sources = sourceReport.sources; // preserve sources
    return result;
  } catch (error) {
    return sourceReport;
  }
};
